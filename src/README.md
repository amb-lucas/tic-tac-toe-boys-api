# Tic-Tac-Toe-Boys-API

API RESTful para um Jogo da velha implementado em Node.js com Express.

# Jogos

## Create game

Rota POST para criação de jogos.

Recebe como parâmetro:

- nome e user, através dos headers.

Exemplo de parâmetros do headers:

```javascript
{
  nome: "Riei",
  user: "uhn1bh1q5"
}
```

Onde nome é o nickname escolhido pelo usuário e o user é uma chave criada para ser o identificador do usuário.

Ela é responsável por criar o jogo e redirecionar o usuário para a sala onde o jogo irá ocorrer.

## Show specific game

Rota GET para listagem dos detalhes de um jogo em específico.

Recebe como parâmetros:

- id do jogo em questão, através da rota;
- nome e user, através dos headers.

Retorna, em formato de JSON, detalhes do jogo incluindo:

- configuração atual do tabuleiro;
- nome dos jogadores;
- round atual;
- vencedor.

Exemplo de JSON com detalhes de um jogo:

```javascript
{
  "state": "123456789",
  "players": [
    "Riei",
    "Fernando"
  ],
  "round": 0,
  "winner": -1
}
```

Essa rota é responsável por apresentar o estado do jogo.

Caso o id informado seja inválido, retornará um erro.

Além disso, ela checa se o usuário está autenticado.

Caso seja autenticado um segundo jogador, o jogo o registrará como participante e iniciará o jogo.

Caso um outro jogador entre, ele será tratado como espectador.

## Show all games

Rota GET para listagem de todos os jogos ainda não terminados.

Não recebe parâmetros.

Retorna um JSON que contém um array com todos os jogos ativos.

Para cada um deles, é retornado o id do jogo e seus detalhes.

Exemplo de JSON com array de jogos:

```javascript
{
  "games": [
    {
      "id": "uhn1bh1q5",
      "game": {
        "state": "123456789",
        "players": [
          "Riei"
        ],
        "round": 0,
        "winner": -1
      }
    }
  ]
}
```

## Update game

Rota PUT para atualizar o estado do jogo jogado pelos jogadores que jogam o jogo.

Ele recebe como parâmetros:

- nome e user, através dos headers;
- choice, posição escolhida para o turno do usuário, através do body;

Exemplo do JSON com escolha:

```javascript
{
	"choice": "2"
}
```

Faz diversas checagens, incluindo se é a vez da pessoa que requisitou, se a posição já foi escolhida, se o jogo já foi concluído.

Caso alguma das validações falhem, é retornada uma mensagem de erro.

Exemplo do JSON com mensagem de erro:

```javascript
{
  "error": "Não é sua vez de jogar, espere Fernando jogar."
}
```

Caso contrário, o estado do jogo é atualizado.

Exemplo do JSON do estado atualizado:

```javascript
{
  "state": "OOX4O6XXX",
  "players": [
    "Riei",
    "Fernando"
  ],
  "round": 7,
  "winner": 0
}
```

## Delete game

Rota DELETE para excluir o jogo da memória.

Ele recebe como parâmetros:

- user, através dos headers;
- id, através da rota;

Checa se foi solicitado pelo mesmo usuário que criou a sala.

Caso positivo, executa a deleção e retorna uma mensagem de sucesso.

Caso contrário, retorna uma mensagem de erro.

Exemplo do JSON com mensagem de erro:

```javascript
{
  error: "Falta permissão para a deleção do jogo.";
}
```

# About Sessions

As sessões são monitoradas no front-end, a API não as armazena, apenas utiliza as chaves criadas para determinar quais usuários estão participando dos jogos.
