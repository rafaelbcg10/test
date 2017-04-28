//dependencia
const request = require('request');

/**
 * Classe responsável por tratar os comentários de vídeo no YouTube
 */
class Nerdologiatron {
	/**
	 * Construtor da classe
	 *
	 * @param {string} key Chave de API para acesso aos recursos do YouTube
	 * @param {string} video ID do vídeo a ser acompanhado
	 */
	constructor(key, video) {
		this._key = key;
		this._video = video;
		this._pageToken = null;
		this._comments = [];
	}

	/**
	 * Realiza as chamadas para obter e armazenar todos os comentários do vídeo.
	 *
	 * @param {Function} success Callback a ser executada após o carregamento dos comentários com sucesso
	 * @param {Function} error Callback a ser executada caso ocorra algum erro
	 */
	load(success,error) {
		//montando a url da requisição ao youtube
		let url = 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&order=time'
			+ '&videoId='+this._video
			+ '&key='+this._key;

		if(this._pageToken)
			url += '&pageToken='+this._pageToken;
		else
			this._comments = [];

		//efetuando requisição
		request({
			url: url,
			json: true
		}, (err, response, body) => {
			//verificando retorno válido
			if (!err && response.statusCode === 200) {
				//formatando comentários recebidos e adicionando aos existentes
				this._comments = body.items.map(
					obj => {
						let snippet = obj.snippet.topLevelComment.snippet;
						return {
							id: snippet.authorChannelId.value,
							author: snippet.authorDisplayName,
							url: snippet.authorChannelUrl,
							image: snippet.authorProfileImageUrl,
							text: snippet.textOriginal.trim(),
							likes: snippet.likeCount,
							date: snippet.publishedAt
						};
					}
				).concat(this._comments);
				//marcando indicador para proxima requisição
				this._pageToken = body.nextPageToken;

				//verificando se finalizou a busca
				if(body.pageInfo.totalResults >= body.pageInfo.resultsPerPage)
					this.load(success,error);
				else if(typeof success == 'function')
					success();
			}
			//retorno incorreto
			else if(typeof error == 'function')
				error();
		});
	}

	/**
	 * Filtra os comentários de acordo com um padrão determinado.
	 *
	 * @param {RegExp} exp Expressão regular responsável por filtrar as mensagens
	 * @param {boolean} lines Indica se deve fragmentar as mensagens por quebra de linha
	 * @param {boolean} remove Indica se deve remover as partes do texto que casam com a expressão regular
	 * @return {Array} Lista contendo apenas os comentários filtrados.
	 */
	filter(exp, lines, remove) {
		let response = [];

		for(let comment of this._comments) {
			//verificando fragmentação do texto em vários (linhas)
			let parts = (lines) ? comment.text.split('\n') : [comment.text];

			for(let part of parts) {
				//checando se a frase encaixa no filtro
				if(exp.test(part)) {
					//formatando frase válida para o retorno
					let clone = Object.assign({},comment);
					clone.text = (remove) ? part.replace(exp,'') : part;
					response.push(clone);
				}
			}
		}

		return response;
	}
}

module.exports = Nerdologiatron;
