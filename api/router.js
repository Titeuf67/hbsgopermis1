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
router.get('/', async (req, res) => {
    const data = await db.query(`SELECT * FROM permis`)

    if (data.length > 0) {
        res.render('home', {
            dbPermis: data
        })

    } else {
        res.redirect('/')

    }

})

router

    // pour les permis
    .get('/permis', async (req, res) => {
        const { id } = req.params
        const data = await db.query(`SELECT * FROM permis WHERE id = ${id}`)

        if (data.length > 0) {
            res.render('pageIdAuto', {
                permis: data[0]
            })

        } else {
            res.redirect('/')

        }

    })
    .post('/permis', (req, res) => {
        console.log('POST::permis', req.body)
        const { name, description } = req.body;

        db.query(`
    INSERT INTO permis (name, description)
        VALUES ("${name}", "${description}")
    `, (err, data) => {
            db.query(`SELECT * from permis WHERE id = ${data.insertId}`, (err, obj) => {
                db.query('SELECT * FROM permis', (err, arr) => {
                    // res.json({ ...req.body, data, obj, arr })
                    res.redirect('/admin')
                })
            })

        })
    })
    // .post('/permis', async (req, res) => {
    //     const { name, description } = req.body;

    //     if (name & description) {
    //         await db.query(`INSERT INTO permis (name, description) VALUES ('${name}', '${description}')`)
    //         res.redirect('/admin')

    //     } else res.send('Error')

    // })
    .put('/permis/:id', async (req, res) => {
        const { name, description } = req.body;
        const { id } = req.params;

        if (name) await db.query(`UPDATE permis set name = "${name}" WHERE id = ${id};`)
        if (description) await db.query(`UPDATE permis set description = "${description}" WHERE id = ${id};`)

        const dbPermis = await db.query(`SELECT * FROM permis`)

    })
    .delete('/permis/:id', async (req, res) => {
        const { id } = req.params;

        await db.query(`DELETE from permis WHERE id = ${id}`)
        res.redirect('/admin')
    })

router.get('/inscription', function (req, res) {
    res.render('inscription')
})

router.get('/forminscription', function (req, res) {
    res.render('forminscription')
})
    .post('/forminscription', function (req, res) {
        console.log("forminscription", req.body)
        res.render('forminscription')
    })

router
    .post('/login', function (req, res) {
        console.log("login", req.body)
        res.render('forminscription')
    })

router.get('/pageIdAuto', function (req, res) {
    res.render('pageIdAuto')
})

router.get('/admin', async (req, res) => {
    const dbPermis = await db.query(`SELECT * FROM permis`)
    // const dbUsers = await db.query(`SELECT * FROM user`)

    if (dbPermis.length > 0) {
        res.render("admin", {
            // Quand nous utilisons un layout qui n'est pas celui par default nous devons le spécifié
            layout: "adminLayout",
            dbPermis,
            users: fkdb.users,
            articles: fkdb.articles
            // dbUsers
        });
    } else {
        res.redirect('/')
    }

})

module.exports = router
