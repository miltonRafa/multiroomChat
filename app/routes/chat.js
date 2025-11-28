/* 
 * Rotas relacionadas ao chat
 * Define endpoints HTTP para acessar/iniciar o chat
 */
module.exports = function(application){
    // Rota POST /chat - recebe dados do formulário com apelido
    application.post('/chat', function (req, res){
        application.app.controllers.chat.iniChat(application, req, res);
    });

    // Rota GET /chat - acesso direto à página de chat (caso necessário)
    application.get('/chat', function (req, res){
        application.app.controllers.chat.iniChat(application, req, res);
    });
}