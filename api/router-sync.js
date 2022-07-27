const fkdb = require("./config/db.json")
const express = require("express");
const router = express.Router()

const db = require('./config/db')

// db.query('select * from permis', (err, data) => {
//     console.log('iciciciROUTERci', data)
// })

// Import des middlewares
// const { isAdmin } = require('./middleware');

// Router
router.get('/', function (req, res) {

    db.query(`SELECT * FROM permis`, (err, data) => {
        console.log('data', data)
        if (err) console.log(err)
        else if (data.length > 0) {
            res.render('home', {
                dbPermis: data
            })
        } else {
            res.redirect('/')
        }

    })

})

router.get('/permis/:id', (req, res) => {
    const { id } = req.params

    db.query(`SELECT * FROM permis WHERE id = ${id}`, (err, data) => {
        console.log('data', data)
        if (err) console.log(err)
        else if (data.length > 0) {
            res.render('pageIdAuto', {
                permis: data[0]
            })
        } else {
            res.redirect('/')
        }
    })
})
    .post('/permis', (req, res) => {
        console.log('POST::permis', req.body.name)
        const { name, description } = req.body;
        
        db.query(`
        INSERT INTO permis (name, description)
            VALUES ("${name}", "${description}")
        `, (err, data) => {
            db.query(`SELECT * from permis WHERE id = ${data.insertId}`, (err, obj) => {
                db.query('SELECT * FROM permis', (err, arr) => {
                    res.json({ ...req.body, data, obj, arr })
                })
            })

        })
    })
    .put('/permis/:id', (req, res) => {
        console.log('PUT::permis', req.body.name)
        const { name, description } = req.body;
        const { id } = req.params;

        db.query(`
        UPDATE permis set name = "${name}", description = "${description}"
            WHERE id = ${id}
        `, (err) => {
            res.redirect('/admin')
        })
    })
    .delete('/permis/:id', (req, res) => {
        console.log('DELETE::permis')
        const { id } = req.params;

        db.query(`DELETE from permis WHERE id = ${id}`, (err) => {
            res.redirect('/admin')
        })
    })

router.get('/inscription', function (req, res) {
    res.render('inscription')
})

router.get('/pageIdAuto', function (req, res) {
    res.render('pageIdAuto')
})

router.get('/admin', function (req, res) {
    db.query(`SELECT * FROM permis`, (err, data) => {
        console.log('data', data)
        if (err) console.log(err)
        else if (data.length > 0) {
            res.render("admin", {
                // Quand nous utilisons un layout qui n'est pas celui par default nous devons le spécifié
                layout: "adminLayout",
                dbPermis: data,
                users: fkdb.users,
                articles: fkdb.articles
            });
        } else {
            res.redirect('/')
        }

    })

})

module.exports = router
