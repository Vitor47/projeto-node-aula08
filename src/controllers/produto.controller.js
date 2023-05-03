const { Router } = require("express");
const produtoService = require("../services/produto.service");
const { FormataData } = require("../utils/funcoes");
const authenticationMiddleware = require('../middlewares/auth.middleware');
const Joi = require("joi");

const produtoRoutes = Router();

// Define o esquema de validação para o cadastro de um novo produto
const produtoSchema = Joi.object({
  nome: Joi.string().required(),
  descricao: Joi.string().required(),
  valor_unitario: Joi.number().positive().required(),
  marca: Joi.string().required(),
  imagem: Joi.string().required(),
  quantidade: Joi.number().integer().min(0).required(),
  data_compra: Joi.date().max("now").required(),
});

// Define a rota para listar todos os produtos
produtoRoutes.get("/", async (req, res) => {
  const produtos = await produtoService.getProdutosService();
  return res.status(200).json(produtos);
});

// Define a rota para buscar um produto por nome
produtoRoutes.get("/:nome", async (req, res) => {
  const { nome } = req.params;

  const produto = await produtoService.getProdutoByNomeService(nome);
  return res.status(200).json(produto);
});

// Define a rota para criar um novo produto
produtoRoutes.post("/", async (req, res) => {
  try {
    // Valida os dados de entrada com base no esquema definido
    const { error, value } = produtoSchema.validate(req.body);
    if (error) {
      // Retorna um erro caso os dados de entrada sejam inválidos
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verifica se já existe um produto com o mesmo nome
    const existingProduct = await produtoService.getProdutoByVerifyNomeService(
      value.nome
    );
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Já existe um produto com o mesmo nome" });
    }

    const { data_compra, ...produto } = req.body;
    const dataFormatada = FormataData(data_compra);
    const produtoCreated = await produtoService.createProdutoService({
      ...produto,
      data_compra: dataFormatada,
    });
    return res.status(200).json(produtoCreated);
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao cadastrar o produto" });
  }
});

// Define a rota para atualizar um produto existente por ID
produtoRoutes.put("/:id", authenticationMiddleware,  async (req, res) => {
  try {
    // Valida os dados de entrada com base no esquema definido
    const { error, value } = produtoSchema.validate(req.body);
    if (error) {
      // Retorna um erro caso os dados de entrada sejam inválidos
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;

    // Verifica se já existe um produto com o mesmo nome
    const existingProduct = await produtoService.getProdutoByVerifyUpdateNomeService(
      value.nome, id
    );
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Já existe um produto com o mesmo nome" });
    }

    const { data_compra, ...produto } = req.body;
    const dataFormatada = FormataData(data_compra);
    const produtoUpdated = await produtoService.updateProdutoService(id, {
      ...produto,
      data_compra: dataFormatada,
    });

    return res.status(200).json(produtoUpdated);

  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao editar o produto" });
  }
});

// Define a rota para excluir um produto existente por ID
produtoRoutes.delete("/:id", authenticationMiddleware, async (req, res) => {
  const { id } = req.params;
  const produtoDeleted = await produtoService.deleteProdutoService(id);
  return res.status(200).json(produtoDeleted);
});

module.exports = produtoRoutes;
