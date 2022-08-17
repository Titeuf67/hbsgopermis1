// Import Module global
const express = require('express');
const {engine} = require('express-handlebars');
const app = express();
const bcrypt= require('bcrypt')
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Require Config DB ( MYSQL )
require('./api/config/db')

// Déstructuration de process.env
require('dotenv').config()
const { PORT_NODE } = process.env;

const { inc, upper } = require('./helpers')

// Config Handlebars
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout:"main",
    adminLayout: "adminLayout",
    helpers: {
        inc, upper
    }
}));

/*
 * Config Body-parser
 *********************/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Config method override
app.use(methodOverride('_method'))

// Route fichier static
app.use('/assets', express.static('public'))

app.set('view engine', '.hbs');
app.set('views', './views');

// Router
const ROUTER = require("./api/router");
app.use(ROUTER); 

// Run server
app.listen(PORT_NODE, () => {
    console.log("L'application est démarrer sur le port ", PORT_NODE)
});

// const str = "123456"

// bcrypt.hash(str,10, function(err, hash) {
//    console.log("hash", hash) // Store hash in your password DB.
//    bcrypt.compare(str, hash, (err, result) => {
//     console.log('compare', result)
//    })   
// });




