/* 
 * Controller responsável pela página inicial (home)
 * Renderiza a tela de entrada onde o usuário informa seu apelido
 */
module.exports.home = function(application, req, res) {
    // Renderiza a página inicial passando objeto vazio para validação
    // (usado para exibir erros de validação quando houver)
    res.render("index", {validacao: {}});
}