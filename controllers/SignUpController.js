const User = require("../models/user");
const Credential = require("../models/credential");
const bcrypt = require("bcrypt");
const { response } = require("express");
const saltRounds = 10;

class SignupController {
  static async Execute(req, res) {
    console.log(req.body);
    const {
      firstName,
      lastName,
      email,
      mobile,
      dialCode,
      isVerified,
      role,
      password,
      confirmPassword,
      department,
      designation
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobile ||
      !isVerified ||
      !dialCode ||
      !role ||
      !department ||
      !designation ||
      !password ||
      !confirmPassword
    ) {
      res.status(400).json({
        message: `Invalid Request`,
      });
    } else {
      console.log(req.body);
      const user = new User({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        isVerified: isVerified,
        dialCode: dialCode,
        department: department,
        designation: designation,
        role: role.trim(),
      });

      const existingUser = await User.find({
        email: email,
      });

      if (existingUser.length > 0) {
        res.status(400).json({
          message: `Email Address is already registered`,
        });
      } else {



        user.save().then(response => {
          if (password === confirmPassword) {
            bcrypt.hash(password, saltRounds).then(async function (hash) {
              // Store hash in your password DB.
              const credential = new Credential({
                user: response._id,
                email: response.email.trim(),
                password: hash,
                role: "employee",
                OTP: password,
              });

              credential.save().then(() => {
                res.status(200).json({
                  message: `user added sucessfully`,
                });
              }).catch(err => {
                return res.status(400).send(err);
              })
            });
          } else {
            res.status(400).json({
              message: `Password does not match`,
            });
          }
        }).catch(err => {
          return res.status(400).send(err, response);
        })

      }
    }

  }
}

module.exports = SignupController;
