/* 
 * Rotas da página inicial
 * Define a rota raiz (/) que exibe a tela de entrada do chat
 */
module.exports = function(application){
    // Rota GET / - página inicial onde usuário informa seu apelido
    application.get('/', function (req, res){
        application.app.controllers.index.home(application, req, res);
    });
}