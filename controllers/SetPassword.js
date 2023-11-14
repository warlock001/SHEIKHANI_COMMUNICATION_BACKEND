const Credential = require("../models/credential");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class SetPasswordController {
    static async Execute(req, res) {

        const { password, confirmPassword, id } = req.body;


        if (!password || !confirmPassword || !id) {

            res.status(400).send({
                message: "Invalid request",
            });

        } else {

            await Credential.find({ password: id }).then(async result => {

                if (result.length == 0) {
                    return res.status(400).json({
                        message: "Incorrect Code"
                    });


                } else {
                    await bcrypt.hash(password, saltRounds).then(async function (hash) {


                        await Credential.findOneAndUpdate(
                            { '_id': result[0]._id },
                            {
                                $set:
                                {
                                    password: hash,
                                    OTP: password

                                }
                            }
                        ).then(response => {

                            User.findOneAndUpdate(
                                { '_id': result[0].user },
                                {
                                    $set:
                                    {
                                        isVerified: true,

                                    }
                                }
                            ).then(() => {
                                res.status(200).json({
                                    message: `user password added sucessfully`,
                                });
                            })



                        }).catch(err => {
                            return res.status(400).send(err);
                        })



                    })
                }
            })

        }

    }

}

module.exports = SetPasswordController