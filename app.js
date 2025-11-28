/* importar as configurações do servidor */
var app = require('./config/server');

/* parametrizar a porta de escuta */
var server = app.listen(8080, function(){
	console.log('servidor online');
})

/* importar o módulo do socket.io */
var io = require('socket.io').listen(server);

/* disponibilizar o objeto io globalmente via Express */
app.set('io', io);

/* 
 * Objeto para armazenar timers de desconexão pendentes
 * Formato: { 'apelido': timerID, ... }
 * Usado para evitar notificar saída quando usuário apenas recarrega a página
 */
var usuariosConectados = {};

/* 
 * Objeto para armazenar usuários atualmente online
 * Formato: { 'apelido': true, ... }
 * Usado para saber se é uma entrada nova ou reconexão
 */
var usuariosOnline = {};

/* criar a conexão por websocket */
io.on('connection', function(socket){

	/* 
	 * Evento: registrarApelido
	 * Disparado quando o cliente envia seu apelido ao conectar
	 * Armazena o apelido no socket para uso posterior
	 */
	socket.on('registrarApelido', function(dados){
		// Guarda o apelido no objeto socket para acesso em outros eventos
		socket.apelido = dados.apelido;
		
		/* 
		 * Evento: msgParaServidor
		 * Disparado quando o cliente envia uma mensagem de chat
		 * Retransmite a mensagem para todos os clientes conectados
		 */
		socket.on('msgParaServidor', function(dados){
			// Envia a mensagem para o próprio cliente que enviou
			socket.emit('msgParaCliente', {apelido: socket.apelido, mensagem: dados.mensagem});
			// Envia a mensagem para todos os outros clientes conectados (broadcast)
			socket.broadcast.emit('msgParaCliente', {apelido: socket.apelido, mensagem: dados.mensagem});
		});

		/* 
		 * Verifica se existe um timer de desconexão pendente para este apelido
		 * Isso acontece quando o usuário recarrega a página:
		 * 1. disconnect() inicia timer de 3 segundos
		 * 2. Página recarrega e registrarApelido é chamado novamente
		 * 3. O timer é cancelado antes de notificar a saída
		 */
		if(usuariosConectados[dados.apelido]){ 
			clearTimeout(usuariosConectados[dados.apelido]); // Cancela o timer
			delete usuariosConectados[dados.apelido]; // Remove da lista
		} else if(!usuariosOnline[dados.apelido]) {
			// Se não tinha timer pendente E não estava online, é entrada nova (não é reload)
			io.emit('msgParaCliente', {apelido: dados.apelido, mensagem: 'entrou no chat'});
			usuariosOnline[dados.apelido] = true; // Marca como online
			
			// Envia lista atualizada de participantes para o próprio cliente
			socket.emit('atualizaParticipantes', {participantes: Object.keys(usuariosOnline)});
			// Envia lista atualizada de participantes para todos os outros clientes
			socket.broadcast.emit('atualizaParticipantes', {participantes: Object.keys(usuariosOnline)});
		}
	});

	/* 
	 * Evento: disconnect
	 * Disparado automaticamente pelo Socket.io quando a conexão é perdida
	 * (usuário fecha aba, perde internet, recarrega página, etc)
	 */
	socket.on('disconnect', function(){
		
		/* 
		 * Aguarda 3 segundos antes de notificar que o usuário saiu
		 * Motivo: diferenciar reload de página (reconecta em ~1s) de saída real
		 * Se o usuário reconectar neste período, o timer será cancelado
		 */
		if(socket.apelido){
			// Cria um timer e armazena sua referência no objeto usuariosConectados
			usuariosConectados[socket.apelido] = setTimeout(function(){
				// Após 3 segundos, notifica todos os clientes que o usuário saiu
				io.emit('usuarioSaiu', {apelido: socket.apelido});
				// Remove o timer da lista de pendências
				delete usuariosConectados[socket.apelido];
				// Remove da lista de usuários online
				delete usuariosOnline[socket.apelido];
				
				// Envia lista atualizada de participantes para o próprio cliente
				socket.emit('atualizaParticipantes', {participantes: Object.keys(usuariosOnline)});
				// Envia lista atualizada de participantes para todos os outros clientes
				socket.broadcast.emit('atualizaParticipantes', {participantes: Object.keys(usuariosOnline)});
			}, 3000); // 3000ms = 3 segundos
		}
	});
});