const connection = require('../database/connection');

// Define a rota para listar todos os usuários
const getUsersModel = () => {
    return connection.execute('SELECT * FROM users');
};

// Define a rota para buscar um usuário por ID
const getUserByIdModel = async (id) => {
        return await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
};

// Define a rota para buscar um usuário por ID
const getUserByEmailModel = async (email) => {
    return await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
};

// Valida um produto unico no editar
const getUserByVerifyUpdateEmailModel = async (email, id) => {
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ? AND id != ? LIMIT 1', [email, id]);
    return rows[0] || null;
};

// Define a rota para validar email e password
const getUserByEmailPasswordModel = async (email, password) => {
    return await connection.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
};

// Define a rota para criar um novo usuário
const createUserModel = async (user) => {
    const [userCreated] = await connection.execute(`INSERT INTO users (name, email, cpf, password) VALUES (?, ?, ?, ?)`, [user.name, user.email, user.cpf, user.password]);
    return { 
        id: userCreated.insertId
    };
};

// Define a rota para atualizar um usuário existente por ID
const updateUserModel = (id, user) => {
    return connection.execute('UPDATE users SET name = ?, email = ?, cpf = ?, password = ? WHERE id = ?', [user.name, user.email, user.cpf, user.password, id]);
};

// Define a rota para excluir um usuário existente por ID
const deleteUserModel = async (id) => {
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    return "Usuário deletado com sucesso!";
};

module.exports = { 
    getUsersModel,
    getUserByIdModel,
    getUserByEmailModel,
    createUserModel,
    updateUserModel,
    deleteUserModel,
    getUserByEmailPasswordModel,
    getUserByVerifyUpdateEmailModel
};