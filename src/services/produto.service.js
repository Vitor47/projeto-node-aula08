const { getProdutosModel, getProdutoByNomeModel, createProdutoModel, updateProdutoModel, deleteProdutoModel, getProdutoByVerifyNomeModel, getProdutoByVerifyUpdateNomeModel } = require('../models/produto.model');

const getProdutosService = async () => {
    const [produtos] = await getProdutosModel();
    return produtos;
}

const getProdutoByNomeService = async (nome) => {
    const [produto] = await getProdutoByNomeModel(nome);
    return produto;
}

const getProdutoByVerifyNomeService = async (nome) => {
    const produto = await getProdutoByVerifyNomeModel(nome);
    return produto;
}

const getProdutoByVerifyUpdateNomeService = async (nome, id) => {
    const produto = await getProdutoByVerifyUpdateNomeModel(nome, id);
    return produto;
}


const createProdutoService = async (produto) => {
    const { id } = await createProdutoModel(produto);
    produto.id = id;
    return produto;
 }
 
 const updateProdutoService = async (id, produto) => {
     await updateProdutoModel(id, produto);
     return produto;
 };
 
 const deleteProdutoService = (id) => {
     return deleteProdutoModel(id);
 };

module.exports = {
    getProdutosService,
    getProdutoByNomeService,
    createProdutoService,
    updateProdutoService,
    deleteProdutoService,
    getProdutoByVerifyNomeService,
    getProdutoByVerifyUpdateNomeService,
}