require("dotenv").config();

var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 465,
  auth: {
    user: 'info@artisan10x.com',
    pass: 'Dontaskme11!',
  },
});

module.exports = transport;
