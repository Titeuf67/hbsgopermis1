const nodemailer = require("nodemailer");
require('dotenv').config()

const { MAIL_SERVICE, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } = process.env;

var transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    host: MAIL_HOST,
    port: MAIL_PORT,
    // secure: true,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    },
    // tls: {
    //     ciphers: MAIL_TLS
    // }
});

module.exports = transporter