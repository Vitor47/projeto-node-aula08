const { createUserModel, deleteUserModel, updateUserModel, getUserByIdModel, getUsersModel, getUserByEmailModel, getUserByEmailPasswordModel, getUserByVerifyUpdateEmailModel } = require('../models/user.model');
const { generateJWTToken } = require('../utils/jwt');

const getUsersService = async () => {
    const [users] = await getUsersModel();
    return users;
};

const getUserByIdService = async (id) => {
    const [user] = await getUserByIdModel(id);
    return user;
}

const getUserByVerifyEmailService = async (email) => {
    const verifyEmail = await getUserByEmailModel(email);
    return verifyEmail;
}

const getUserByVerifyUpdateEmailService = async (email, id) => {
    const verifyEmail = await getUserByVerifyUpdateEmailModel(email, id);
    return verifyEmail;
}

const createUserService = async (user) => {
    const { id } = await createUserModel(user);
    user.id = id;
    return user;
}

const updateUserService = async (id, user) => {
    await updateUserModel(id, user);
    return 'Usuário atualizado com sucesso';
};

const deleteUserService = (id) => {
    return deleteUserModel(id);
};

const authentication = async ({ email, password }) => {
    if (!email || !password) {
        throw { status: 401, message: "Campos faltantes." };
    }

    const [user] = await getUserByEmailPasswordModel(email, password);

    if (!user) {
        throw { status: 401, message: 'Usuário ou senha inválido' };
    }

    // Gerar o token
    const token = generateJWTToken(JSON.stringify(user));
    return { token };

}

module.exports = {
    getUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService,
    authentication,
    getUserByVerifyEmailService,
    getUserByVerifyUpdateEmailService
}