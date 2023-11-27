require("dotenv").config();

var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 465,
  auth: {
    user: 'info@test-sheikhani.it-ace.com',
    pass: 'It-ace123',
  },
});

module.exports = transport;
