const mysql = require('mysql2/promise');
require('dotenv').config();

//console.log(process.env.DB_HOSTNAME)
//console.log(process.env.DB_USER)
//console.log(process.env.DB_PASSWORD)
//console.log(process.env.DB_DATABASE)

// Cria uma conexão com o banco de dados MySQL
const connection = mysql.createPool({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 33063
});

module.exports = connection;