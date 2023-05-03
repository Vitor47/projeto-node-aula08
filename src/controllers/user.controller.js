const bcrypt = require('bcryptjs');
const { Router } = require("express");
const userService = require("../services/user.service");
const authenticationMiddleware = require("../middlewares/auth.middleware");

const userRoutes = Router();

// Define a rota para listar todos os usuários
userRoutes.get("/", async (req, res) => {
  const users = await userService.getUsersService();
  return res.status(200).json(users);
});

// Define a rota para buscar um usuário por ID
userRoutes.get("/:id", authenticationMiddleware, async (req, res) => {
  const { id } = req.params;

  const user = await userService.getUserByIdService(id);
  return res.status(200).json(user);
});

// Define a rota para criar um novo usuário
userRoutes.post("/", async (req, res) => {
  try {
    // Extrai os dados do corpo da requisição
    const { password, email, ...userData } = req.body;

    // Verifica se o usuário já existe com o mesmo e-mail
    const [existingUser] = await userService.getUserByVerifyEmailService(email);

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Já existe um usuário com o mesmo e-mail" });
    }

    // Criptografa a senha usando bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(password, salt);

    // Salva o usuário no banco de dados com a senha criptografada
    const userCreated = await userService.createUserService({
      ...userData,
      email: email,
      password: hashedSenha,
    });

    return res.status(200).json(userCreated);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao cadastrar o usuário" });
  }
});

// Define a rota para atualizar um usuário existente por ID
userRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password, email, ...userData } = req.body;

    // Verifica se o usuário existe
    const existingUser = await userService.getUserByIdService(id);
    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Verifica se o e-mail está sendo alterado para um e-mail já existente
    if (email && email !== existingUser.email) {
      const existingEmail = await userService.getUserByVerifyUpdateEmailService(email, id);
      if (existingEmail.length > 0) {
        return res
          .status(400)
          .json({ error: "Já existe um usuário com o mesmo e-mail" });
      }
    }

    // Criptografa a nova senha (se fornecida)
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Atualiza o usuário com os dados fornecidos
    const userUpdated = await userService.updateUserService(id, {
      ...userData,
      email: email,
      password: hashedPassword,
    });

    return res.status(200).json(userUpdated);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao atualizar o usuário" });
  }
});

// Define a rota para excluir um usuário existente por ID
userRoutes.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userDeleted = await userService.deleteUserService(id);
  return res.status(200).json(userDeleted);
});

userRoutes.post("/login", async (req, res) => {
  const token = await userService.authentication(req.body);
  res.status(200).json(token);
});

module.exports = userRoutes;
