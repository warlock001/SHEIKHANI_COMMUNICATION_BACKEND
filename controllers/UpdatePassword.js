const bcrypt = require("bcrypt");
const Credential = require("../models/credential");
const saltRounds = 10;

class UpdatePasswordController {
    static async Execute(req, res) {

        const { id, currectPassword, newPassword, } = req.body;


        if (
            !id ||
            !currectPassword ||
            !newPassword
        ) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else {

            const existingUser = await Credential.findOne({
                user: id,
            });

            await bcrypt
                .compare(currectPassword.trim(), existingUser.password)
                .then(async function (result) {
                    if (result == true) {

                        await bcrypt.hash(newPassword, saltRounds).then(async function (hash) {
                            await Credential.findOneAndUpdate(
                                { user: id },
                                {
                                    password: hash,
                                    OTP: newPassword
                                }
                            ).then(response => {
                                res.status(200).json({
                                    message: "password updated successfully",
                                    user: response
                                });
                            }).catch(err => {
                                res.status(400).send({
                                    message: err,
                                });
                            })
                        })
                    } else {
                        res.status(400).send({
                            message: "Incorrect Password",
                        });
                    }
                })
        }
    }
}


module.exports = UpdatePasswordController;