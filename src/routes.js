const express = require("express");

const GameController = require("./controllers/gameController");

const routes = express.Router();

routes.get("/games", GameController.index);
routes.post("/games", GameController.create);
routes.get("/games/:id", GameController.show);
routes.post("/games/:id", GameController.post);

module.exports = routes;
