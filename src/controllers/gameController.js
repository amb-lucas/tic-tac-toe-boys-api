const generateId = require("../utils/idGenerator");

const games = new Map();

const filterResponseData = (game) => ({
  state: game.state,
  players: game.players.map((item) => item.name),
  round: game.round,
  winner: game.winner,
});

const createGame = ({ name, user }) => {
  const id = generateId();
  while (games.has(id)) id = generateId();
  games.set(id, {
    state: "123456789",
    players: [{ name, user }],
    round: 0,
    winner: -1,
  });
  return id;
};

const checkFilled = (tab, a, b, c) => {
  if (tab[a] === tab[b] && tab[b] === tab[c] && tab[c] === "O") return true;
  if (tab[a] === tab[b] && tab[b] === tab[c] && tab[c] === "X") return true;
  return false;
};

const gameOver = (tab) => {
  if (checkFilled(tab, 0, 1, 2)) return true;
  if (checkFilled(tab, 3, 4, 5)) return true;
  if (checkFilled(tab, 6, 7, 8)) return true;

  if (checkFilled(tab, 0, 3, 6)) return true;
  if (checkFilled(tab, 1, 4, 7)) return true;
  if (checkFilled(tab, 2, 5, 8)) return true;

  if (checkFilled(tab, 0, 4, 8)) return true;
  if (checkFilled(tab, 2, 4, 6)) return true;

  return false;
};

module.exports = {
  async create(req, res) {
    const { user, name } = req.headers;
    const newGameId = createGame({ user, name });
    return res.redirect(`/games/${newGameId}`);
  },

  async index(req, res) {
    const ans = [];
    for (let [key, value] of games) {
      ans.push({
        id: key,
        game: filterResponseData(value),
      });
    }
    return res.send({ games: ans });
  },

  async show(req, res) {
    const { id } = req.params;
    const { user, name } = req.headers;

    if (!name) return res.send({ error: "Favor, crie um registro antes." });
    if (!games.has(id)) return res.send({ error: "Jogo não encontrado." });

    const game = games.get(id);

    // Se um outro usuário válido requisitar o jogo, ele será o segundo jogador
    if (user !== game.players[0].user && game.players.length === 1) {
      game.players.push({ user, name });
    }

    res.send(filterResponseData(games.get(id)));
  },

  async update(req, res) {
    const { id } = req.params;
    const { user } = req.headers;
    const { choice } = req.body;

    const game = games.get(id);

    if (game.winner !== -1) {
      res.send({
        error: "O jogo já foi concluído.",
      });
    } else if (game.round === 9) {
      res.send({
        error: "O jogo já foi concluído. Deu velha, bro",
      });
    } else if (user !== game.players[game.round % 2].user) {
      if (user !== game.players[1 - (game.round % 2)].user) {
        res.send({
          error: "Você é um espectador deste jogo.",
        });
      } else {
        res.send({
          error: `Não é sua vez de jogar, espere ${
            game.players[game.round % 2].name
          } jogar.`,
        });
      }
    } else if (
      game.state[choice - 1] === "O" ||
      game.state[choice - 1] === "X"
    ) {
      res.send({
        error: "A posição já foi escolhida.",
      });
    } else {
      game.state = game.state.replace(choice.toString(), "XO"[game.round % 2]);
      if (gameOver(game.state)) game.winner = game.round % 2;
      game.round++;

      // Se o jogo tiver acabado, agendar deleção em 1 dia.
      if (game.round === 9 || game.winner !== -1) {
        setTimeout(() => {
          if (games.has(id)) games.delete(id);
        }, 1000 * 24 * 3600);
      }

      res.send(filterResponseData(game));
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    const { user } = req.headers;

    if (!games.has(id)) return res.send({ error: "Jogo não encontrado." });

    const game = games.get(id);
    if (user === game.players[0].user) {
      games.delete(id);
      res.send({ ok: "Jogo deletado com sucesso." });
    } else res.send({ error: "Falta permissão para a deleção do jogo." });
  },
};
