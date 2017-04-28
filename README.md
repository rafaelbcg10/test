# Nerdologiatron 2.0

Serviço para filtrar comentários de um vídeo no Youtube utilizando a API v3.

**Importante:** Desenvolvido para Node.js a partir da versão 7.

![home2](https://cloud.githubusercontent.com/assets/924158/25513366/fa94cc9e-2baa-11e7-9afa-f0a1009598a6.png)

## Configuração

Para utilizar o recurso, é necessário possuir o ID do vídeo que será acompanhado e uma Chave de API.

### ID do Vídeo
Para obter a ID do vídeo, basta acessar o endereço do mesmo e abstrair de sua URL. O mesmo estará localizado
logo após o `https://www.youtube.com/watch?v=`:
![home2](https://cloud.githubusercontent.com/assets/924158/25513415/436968d0-2bab-11e7-9b56-af27e7ea7140.png)

### Chave de API

Para obter uma Chave de API siga os seguintes passos:
- Acesse [Google API Console](https://console.developers.google.com/apis/)
- Crie um novo Projeto
- Acesse no menu lateral a opção Painel
- Ative o YouTube Data API
- Acesse no menu lateral a opção de Credenciais
- Crie uma nova credencial de Chave de API
- Copie a chave e ignore a opção de restrição de acesso

## Instalação

Para instalar, basta utilizar o comando via npm:
```sh
npm install nerdologiatron --save
```

## API

### new Nerdologiatron(key, video)
- `key` **String** - Chave de API para acesso aos recursos do YouTube
- `video` **Object** - ID do vídeo a ser acompanhado

Construtor da classe, instanciando variáveis de controle.

### nerdologiatron.load([success[, error]])
- `success` **Function** - Função a ser executada após o carregamento dos comentários com sucesso
- `error` **Function** - Função a ser executada caso ocorra algum erro

Realiza as chamadas para obter e armazenar todos os comentários do vídeo.

### nerdologiatron.filter(exp, lines, remove)
- `exp` **RegExp** - Expressão regular responsável por filtrar as mensagens
- `lines` **Boolean** - Indica se deve fragmentar as mensagens por quebra de linha
- `remove` **Boolean** - Indica se deve remover as partes do texto que casam com a expressão regular

Filtra os comentários de acordo com um padrão determinado.

Retorna um Array contendo apenas os comentários filtrados.
