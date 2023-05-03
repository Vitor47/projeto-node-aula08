const connection = require('../database/connection');

const getProdutosModel = () => {
    return connection.execute('SELECT * FROM produto');
};

// Define a rota para buscar um produto por nome
const getProdutoByNomeModel = async (nome) => {
    return await connection.execute('SELECT * FROM produto WHERE nome = ?', [nome]);
};

// Valida um produto unico no cadastrar
const getProdutoByVerifyNomeModel = async (nome) => {
    const [rows] = await connection.execute('SELECT * FROM produto WHERE nome = ? LIMIT 1', [nome]);
    return rows[0] || null;
};

// Valida um produto unico no editar
const getProdutoByVerifyUpdateNomeModel = async (nome, id) => {
    const [rows] = await connection.execute('SELECT * FROM produto WHERE nome = ? AND id != ? LIMIT 1', [nome, id]);
    return rows[0] || null;
};

// Define a rota para criar um novo produto
const createProdutoModel = async (produto) => {
    const [produtoCreated] = await connection.execute(`INSERT INTO produto (nome, descricao, valor_unitario, marca, imagem, quantidade, data_compra) VALUES (?, ?, ?, ?, ?, ?, ?)`, [produto.nome, produto.descricao, produto.valor_unitario, produto.marca, produto.imagem, produto.quantidade, produto.data_compra]);
    return { 
        id: produtoCreated.insertId
    };
};

// Define a rota para atualizar um produto existente por ID
const updateProdutoModel = (id, produto) => {
    return connection.execute('UPDATE produto SET nome = ?, descricao = ?, valor_unitario = ?, marca = ?, imagem = ?, quantidade = ?, data_compra = ? WHERE id = ?', [produto.nome, produto.descricao, produto.valor_unitario, produto.marca, produto.imagem, produto.quantidade, produto.data_compra, id]);
};

// Define a rota para excluir um produto existente por ID
const deleteProdutoModel = async (id) => {
    await connection.execute('DELETE FROM produto WHERE id = ?', [id]);
    return "Produto deletado com sucesso!";
};

module.exports = { 
    getProdutosModel,
    getProdutoByNomeModel,
    createProdutoModel,
    updateProdutoModel,
    deleteProdutoModel,
    getProdutoByVerifyNomeModel,
    getProdutoByVerifyUpdateNomeModel
};