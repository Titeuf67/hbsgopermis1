const fkdb = require("./config/db.json")
const express = require("express");
const router = express.Router()
const db = require('./config/db')
const morgan = require('morgan')
const expressSession = require("express-session");
const MySQLStore = require("express-mysql-session")(expressSession);
const { setSession } = require("./utils/setSession")
// const { isAdmin } = require('./middleware');
const app = express();

const bcrypt = require('bcrypt');
const bcrypt_salt = 10;
app.use(morgan('dev'))
// Import des middlewares
// const { isAdmin } = require('./middleware');

// Router
// routeur get ramene les info sur les cards/
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


// crud table permis
router
    .get('/permis', async (req, res) => {
        const { id } = req.params
        const data = await db.query(`SELECT * FROM permis WHERE id = ${id}`)

        if (data.length > 0) {
            res.render('pageId', {
                permis: data[0]
            })
        } else {
            res.redirect('/')
        }
    })

    // create
    .post('/permis', (req, res) => {
        console.log('post:permis', req.body)
        const { name, description, image } = req.body;

        db.query(`INSERT INTO permis (name, description) VALUES ("${name}", "${description}");`, (err, data) => {
            if (err) throw err;

            db.query(`SELECT * from permis WHERE id = "${data.insertId}"`, (err, obj) => {
                console.log(req.body)
                db.query('SELECT * FROM permis', (err, arr) => {
                    res.redirect('/admin')
                })
            })

        });
    })
// .post('/permis', async (req, res) => {
//     const { name, description } = req.body;

//     if (name & description) {
//         await db.query(`INSERT INTO permis (name, description) VALUES ('${name}', '${description}')`)
//         res.redirect('/admin')

//     } else res.send('Error')

// })

router
    .get('/permis/:id', async (req, res) => {
        const { id } = req.params;
        const dbPermis = await db.query(`SELECT * FROM permis WHERE id=${id}`)
        console.log(dbPermis);

        if (dbPermis.length <= 0) res.redirect('/')
        else res.render('pageId', {
            permis: dbPermis[0]
        })
    })




    // editer
    .put('/permis/:id', async (req, res) => {
        const { name, description, image } = req.body;
        const { id } = req.params;

        if (name) await db.query(`UPDATE permis set name = "${name}" WHERE id = ${id};`)
        if (description) await db.query(`UPDATE permis set description = "${description}" WHERE id = ${id};`)
        // if (image) await db.query(`UPDATE permis set image = "${image}" WHERE id = ${id};`)

        res.redirect('/admin')
    })

    // suprimer
    .delete('/permis/:id', async (req, res) => {
        const { id } = req.params;

        await db.query(`DELETE from permis WHERE id = ${id}`)
        res.redirect('/admin')
    })


// fin des router table permis

// router crud table user

// router.post('/user', (req, res) => {
//     console.log('POST:user', req.body)
//     const { nom, prenom, telephone, email, username, password } = req.body;

//     db.query(`
//         INSERT INTO user (email, username, password)
//             VALUES ("${email}", "${username}", "${password}")
//         `, (err, data) => {
//         db.query(`SELECT * from user WHERE id = ${data.insertId}`, (err, obj) => {
//             db.query('SELECT * FROM user', (err, arr) => {
//                 res.redirect('/admin')
//             })
//         })

//     })
// })
router.put('/user/:id', async (req, res) => {
    const { email, username, password } = req.body;
    const { id } = req.params;

    if (email) await db.query(`UPDATE user set email = "${email}" WHERE id = ${id};`)
    if (username) await db.query(`UPDATE user set username = "${username}" WHERE id = ${id};`)
    if (password) await db.query(`UPDATE user set password = "${password}" WHERE id = ${id};`)

    res.redirect('/admin')
})
router.delete('/user/:id', async (req, res) => {
    const { id } = req.params;

    await db.query(`DELETE from user WHERE id = ${id}`)
    res.redirect('/admin')
})

/*
// route du formulaire pour create*/


// ----------------------------------------------------------------//
// ----------------------SEPARATE----------------------------------//
// ----------------------------------------------------------------//


router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    //  if (password != mdp) {
    //       return
    //  }

    console.log('register', req.body)

    db.query(`
        INSERT INTO user (email, username, password)
            VALUES ( "${email}", "${username}", "${await bcrypt.hash(password, 10)}");`, (err, data) => {
        if (err) console.log(err)
        console.log('data', data)
        db.query(`SELECT * from user WHERE id = ${data.insertId}`, (err, obj) => {
            db.query('SELECT * FROM user', (err, arr) => {
                res.redirect('/admin')
            })
        })

    })
})

// ----------------------------------------------------------------//
// ----------------------SEPARATE----------------------------------//
// ----------------------------------------------------------------//

router.post('/connexion', (req, res) => {
    const { email, password } = req.body
    db.query(`SELECT password FROM user WHERE email="${email}"`, function (err, data) {
        if (err) throw err;
        console.log("connecter");
        if (!data[0]) return res.render('/', { flash: "Ce compte n'existe pas" })
        bcrypt.compare(password, data[0].password, function (err, result) {

            if (result === true) {
                db.query(`SELECT * FROM user WHERE email="${email}"`, (err, data) => {
                    if (err) {
                        console.log('err', err)
                        res.end()
                    } else {
                        req.session.user = {...data[0]};
                        delete req.session.user.password

                        console.log("connexion data", data[0]);
                        res.redirect('/')
                    }
                })
            }
            else return res.render('home')

        });
    })

})


// ----------------------------------------------------------------//
// ----------------------SEPARATE----------------------------------//
// ----------------------------------------------------------------//


// // login/connexion
// router.post('/connexion', function (req, res) {
//     console.log("connexion", req.body)
//     // res.render('forminscription')
//     const { email, password } = req.body;
//     db.query(`SELECT password FROM user WHERE email="${email}"`, function (err, data) {
//         if (err) throw err;

//         if (!data[0]) return res.redirect('/')
//         bcrypt.compare(password, data[0].password, function (err, result) {
//             if (result === true) {
//                  setSession(req, res, email) 

//                 }
//                 else return res.render('connexion')
//                 })
//                 // let user = data[0];
//                 // // Session Connexion for HBS
//                 // app.use('*', (req, res, next) => {
//                 //     res.locals.user = req.session.user;
//                 //     next();
//                 // })
//                 // // Assignation des data user dans la session

//                 // req.session.user = {
//                 //     id: user.id,
//                 //     email: user.email,
//                 //     name: user.name,
//                 //     account_create: user.create_time,

//                 // };

//                 res.redirect('/')
//             })
//             // else return res.render('forminscription')
//         });

// ----------------------------------------------------------------//
// ----------------------SEPARATE----------------------------------//
// ----------------------------------------------------------------//



//   // deconnexion
app.post('/logout', (req, res) => {
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

router.get('/pageId', function (req, res) {
    res.render('pageId')
})

router.get('/admin', async (req, res) => {
    const dbPermis = await db.query(`SELECT * FROM permis`)
    const dbUsers = await db.query(`SELECT * FROM user`)

    if (dbPermis.length > 0) {
        res.render("admin", {
            // Quand nous utilisons un layout qui n'est pas celui par default nous devons le spécifié
            layout: "adminLayout",
            dbPermis,
            dbUsers
        });
    } else {
        res.redirect('/')
    }

})
"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);

module.exports = router
