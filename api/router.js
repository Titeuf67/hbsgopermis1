const fkdb = require("./config/db.json")
const express = require("express");
const router = express.Router()
const db = require('./config/db')
const expressSession = require("express-session");
const MySQLStore = require("express-mysql-session")(expressSession);
// const { isAdmin } = require('./middleware');
const app = express();

const bcrypt = require('bcrypt');
const  bcrypt_salt = 10;
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

    // crud table permis
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
        const { name, description, image } = req.body;

        db.query(`
    INSERT INTO permis (name, description, image)
        VALUES ("${name}", "${description}", "${image}")
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
        const { name, description, image } = req.body;
        const { id } = req.params;

        if (name) await db.query(`UPDATE permis set name = "${name}" WHERE id = ${id};`)
        if (description) await db.query(`UPDATE permis set description = "${description}" WHERE id = ${id};`)
        if (image) await db.query(`UPDATE permis set image = "${image}" WHERE id = ${id};`)

        res.redirect('/admin')
    })
    .delete('/permis/:id', async (req, res) => {
        const { id } = req.params;

        await db.query(`DELETE from permis WHERE id = ${id}`)
        res.redirect('/admin')
    })
router.get('/permis/:id', async (req, res) => {
    const { id } = req.params;
    const dbPermis = await db.query(`SELECT * FROM permis WHERE id=${id}`)
    // console.log(dbPermis);
    res.render('pageIdAuto', {
        dbPermis
    })
})
// fin des router table permis

// router crud table user

router.post('/user', (req, res) => {
    console.log('POST:user', req.body)
    const { nom, prenom, telephone, email, identifiant, password } = req.body;

    db.query(`
INSERT INTO user (nom, prenom, telephone, email, identifiant, password)
    VALUES ("${nom}", "${prenom}", "${telephone}", "${email}", "${identifiant}", "${password}")
`, (err, data) => {
        db.query(`SELECT * from user WHERE id = ${data.insertId}`, (err, obj) => {
            db.query('SELECT * FROM user', (err, arr) => {
                res.redirect('/admin')
            })
        })

    })
})
router.put('/user/:id', async (req, res) => {
    const { nom, prenom, telephone, email, identifiant, password } = req.body;
    const { id } = req.params;

    if (nom) await db.query(`UPDATE user set nom = "${nom}" WHERE id = ${id};`)
    if (prenom) await db.query(`UPDATE user set prenom = "${prenom}" WHERE id = ${id};`)
    if (telephone) await db.query(`UPDATE user set telephone = "${telephone}" WHERE id = ${id};`)
    if (email) await db.query(`UPDATE user set email = "${email}" WHERE id = ${id};`)
    if (identifiant) await db.query(`UPDATE user set identifiant = "${identifiant}" WHERE id = ${id};`)
    if (password) await db.query(`UPDATE user set password = "${password}" WHERE id = ${id};`)

    res.redirect('/admin')
})
router.delete('/user/:id', async (req, res) => {
    const { id } = req.params;

    await db.query(`DELETE from user WHERE id = ${id}`)
    res.redirect('/admin')
})
// route du formulaire pour create
router.post('/register', (req, res) => {
    const { nom, prenom, telephone, email, identifiant, password, mdp } = req.body;

    if (password != mdp) {
        console.error('ERROR PASSWORD NOT EQUALS')
        return
    }

    console.log('register', req.body)

    db.query(`
INSERT INTO user (nom, prenom, telephone, email, identifiant, password)
    VALUES ("${nom}", "${prenom}", "${telephone}", "${email}", "${identifiant}", "${password}")
`, (err, data) => {
        db.query(`SELECT * from user WHERE id = ${data.insertId}`, (err, obj) => {
            db.query('SELECT * FROM user', (err, arr) => {
                res.redirect('/admin')
            })
        })

    })
})


// login/connexion
router.post('/connexion', function (req, res) {
    console.log("connexion", req.body)
    // res.render('forminscription')
    const { email, password } = req.body;
    db.query(`SELECT password FROM user WHERE email="${email}"`, function (err, data) {
        if (err) throw err;

        if (!data[0]) return res.render('/', { flash: "Ce compte n'existe pas" })
        bcrypt.compare(password, data[0].password, function (err, result) {
            if (result === true) { setSession(req, res, email) }
            else return res.render('forminscription', { flash: "L\'email ou le mot de passe n\'est pas correct !" })
        });
    })
})

// // inscription
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    // if(password !== confirm_password) return res.redirect('/')
    if(!name || !email || !password)return res.redirect('/')
    bcrypt.hash(password, bcrypt_salt, function(err, hash) {
      db.query(`INSERT INTO user SET name="${name}", email="${email}", password="${hash}", isAdmin=0`, function (err, data) {
        if (err) throw err;
        res.redirect('/connexion');
      })
    });
  })
//   // deconnexion
  app.post('/logout', (req, res)=>{
    req.session.destroy(() => {
      res.clearCookie('poti-gato');
      console.log("Clear Cookie session :", req.sessionID);
      res.redirect('/');
    });
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

// router
//     .post('/login', function (req, res) {
//         console.log("login", req.body)
//         res.render('forminscription')
//     })

router.get('/pageIdAuto', function (req, res) {
    res.render('pageIdAuto')
})

router.get('/admin', async (req, res) => {
    const dbPermis = await db.query(`SELECT * FROM permis`)
    const dbUsers = await db.query(`SELECT * FROM user`)

    if (dbPermis.length > 0) {
        res.render("admin", {
            // Quand nous utilisons un layout qui n'est pas celui par default nous devons le spécifié
            layout: "adminLayout",
            dbPermis,
            dbUsers,

        });
    } else {
        res.redirect('/')
    }

})

module.exports = router
