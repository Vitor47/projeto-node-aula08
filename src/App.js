// Importa as bibliotecas necessárias
require('express-async-errors');
const express = require('express');
const errorMiddleware = require('./middlewares/error.middleware');
const connection = require('./database/connection');
const routes = require('./routes/router');

const app = express();
const port = 3001; 

//estamos dizendo que nossos dados vão estar no formato JSON
app.use(express.json());

//estamos direcionando todas requisições para nossas rotas
app.use(routes);

app.use(errorMiddleware);

// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
