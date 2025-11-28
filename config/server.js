/* importar o módulo do framework express */
var express = require('express');

/* importar o módulo do consign */
var consign = require('consign');

/* importar o módulo do body-parser */
var bodyParser = require('body-parser');

/* importar o módulo do express-validator */
var expressValidator = require('express-validator');

/* iniciar o objeto do express */
var app = express();

/* 
 * Configuração da view engine
 * Define EJS como template engine e pasta de views
 */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* 
 * Configuração de arquivos estáticos
 * Permite acesso a CSS, JS, imagens da pasta public
 */
app.use(express.static('./app/public'));

/* 
 * Configuração do body-parser
 * Permite capturar dados de formulários via req.body
 */
app.use(bodyParser.urlencoded({extended: true}));

/* 
 * Configuração do express-validator
 * Habilita validações de campos do formulário
 */
app.use(expressValidator());

/* 
 * Autoload de módulos usando Consign
 * Carrega automaticamente rotas, models e controllers
 * Ordem: routes → models → controllers
 * Todos são injetados no objeto app
 */
consign()
	.include('app/routes')      // Carrega as rotas primeiro
	.then('app/models')          // Depois os models (se houver)
	.then('app/controllers')     // Por último os controllers
	.into(app);                  // Injeta tudo no objeto app

/* Exporta o app configurado para ser usado no arquivo principal */
module.exports = app;