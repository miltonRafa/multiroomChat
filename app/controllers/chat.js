/* 
 * Controller responsável pela lógica de inicialização do chat
 * Valida o apelido do usuário e renderiza a página de chat
 */
module.exports.iniChat = function(application, req, res) {
    // Captura os dados enviados pelo formulário (apelido)
    var dadosForm = req.body;
    
    // Validações do campo apelido usando express-validator
    req.assert('apelido', 'Nome ou apelido é obrigatório').notEmpty();
    req.assert('apelido', 'Nome ou apelido deve conter entre 3 e 15 caracteres').len(3, 15);
    var erros = req.validationErrors();

    // Se houver erros de validação, retorna para a página inicial com as mensagens de erro
    if(erros){
        res.render("index", {validacao: erros});
        return;
    }

    // Se validação passou, renderiza a página do chat passando o apelido
    res.render("chat", {apelido: dadosForm.apelido});
}