const User = require("../models/user");

class UpdateUserController {
    static async Execute(req, res) {

        const { id, firstName, lastName, designation, department } = req.body;

        if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
            User.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        firstName: firstName,
                        lastName: lastName,
                        designation: designation,
                        department: department
                    },
                }
            ).then(response => {
                res.status(200).json({
                    message: "user updated successfully",
                    user: response
                });
            }).catch((err) => {
                res.status(400).send({
                    message: err,
                });
            });
        } else {
            res.status(400).json({
                message: `Invalid Request`,
            });
        }
    }

}

module.exports = UpdateUserController;