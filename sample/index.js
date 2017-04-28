'use strict';

//dependências
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const app = express();
const Nerdologiatron = require('../src/nerdologiatron');

//globais
let comments = null;

//configurações do express
app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(express.static('public'));

//rota principal
app.get('/', (req, res) => {
	if(!comments)
		res.render('data');
	else {
		res.render('results',{
			suggestions: comments.filter(/(^nerdologia\s*:?|\|\s*nerdologia$)/gi,true,true),
			questions: comments.filter(/\?{2,}/,false,false)
		});
	}
});

//submit do form de acesso
app.post('/', (req, res) => {
	if(req.body.key && req.body.video && !comments) {
		//instanciando classe e carregando o comentários do vídeo
		comments = new Nerdologiatron(req.body.key, req.body.video);
		comments.load(
			() => {
				res.redirect('/');
				//atualizando os dados para obter novos comentários
				setInterval(() => {
					comments.load();
				},600000);
			},
			() => {
				comments = null;
				res.send('Erro ao conectar com o YouTube');
			});
	} else {
		res.send('Erro. Parâmetros inválidos');
	}
});

//Iniciando o servidor
app.listen(2103, function () {
	console.log('Server started!');
});
