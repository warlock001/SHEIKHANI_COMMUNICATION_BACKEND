const User = require("../models/user");

class FilteredUsersController {
    static async Execute(req, res) {

        const { department } = req.query;

        if (department) {

            await User.find({ department: department }).then(result => {
                return res.status(200).json({
                    message: "Success",
                    users: result
                })
            }).catch(err => {
                return res.status(400).json({
                    message: "Error",
                    error: err
                })
            })

        } else {
            return res.status(400).json({
                message: `Invalid Request`,
            });
        }
    }
}

module.exports = FilteredUsersController;