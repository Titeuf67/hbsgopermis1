const mysql = require('mysql')
require('dotenv').config()
const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } = process.env;

let configDB = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
};

// Création de la connection avec les paramètres donner
db = mysql.createConnection(configDB);

// Config Async
const util = require("util");
db.query = util.promisify(db.query).bind(db);

// Connexion de la db mysql
db.connect((err) => {
    if (err) console.error('error connecting: ', err.stack);
    console.log('connected as id ', db.threadId);
});

module.exports = db
