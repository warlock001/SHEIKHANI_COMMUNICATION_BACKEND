const Credential = require("../models/credential");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class LoginController {
  static async Execute(req, res) {
    console.log(req.body);
    const { email, password } = req.body;

    if (email != undefined && password != undefined) {
      const existingUser = await Credential.findOne({
        email: email.toLowerCase().trim(),
      });
      console.log(existingUser);
      if (existingUser) {
        const user = await User.find({ _id: existingUser.user });

        console.log(user);
        await bcrypt
          .compare(password.trim(), existingUser.password)
          .then(function (result) {
            if (result == true) {
              const token = jwt.sign(
                JSON.stringify({
                  _id: existingUser._id,
                  role: existingUser.role,
                }),
                process.env.ACCESS_TOKEN_JWT
              );
              res.setHeader("x-auth-token", token);
              console.log(user[0].isVerified);
              res.status(200).send({
                message: "Login Successful",
                email: existingUser.email,
                role: existingUser.role,
                firstName: user[0].firstName,
                department: user[0].department,
                _id: user[0]._id,
                token: token,
                isVerified: user[0].isVerified,
                profilePicture: user[0].profilePicture[0],
              });
            } else {
              res.status(400).send({
                message: "Invalid credentials",
              });
            }
          });
      } else {
        res.status(403).send({
          message: "No user found",
        });
      }
    } else {
      res.status(400).send({
        message: "Invalid request",
      });
    }
  }
}

module.exports = LoginController;
