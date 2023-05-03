const { Router } = require ("express");
const userController = require("../controllers/user.controller");
const produtoController = require("../controllers/produto.controller");

const routes = Router();

routes.use('/users', userController);
routes.use('/produtos', produtoController);

module.exports = routes;