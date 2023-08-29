const User = require("../models/user");

class UsersController {
    static async Execute(req, res) {

        const { id, department, query } = req.query;
        console.log(department)
        if (id != undefined && id.match(/^[0-9a-fA-F]{24}$/)) {

            var user = await User.find({
                _id: id,
            })

            if (user && user.length > 0) {
                res.status(200).json({
                    message: "Sucess",
                    user: user,
                });
            } else {
                res.status(200).json({
                    message: "No Record found",
                });
            }

        } else if (department != undefined) {
            console.log(query)
            console.log(department)
            if (query != '') {
                console.log("first")
                var user = await User.find({
                    department: department,
                    firstName: { $regex: '.*' + query + '.*', $options: 'i' }
                }).limit(5);
            } else {
                console.log("second")
                var user = await User.find({
                    department: department
                }).limit(5);
            }


            if (user && user.length > 0) {
                res.status(200).json({
                    message: "Sucess",
                    user: user,
                });
            } else {
                res.status(200).json({
                    message: "No Record found",
                });
            }

        } else {
            var user = await User.find()

            if (user && user.length > 0) {
                res.status(200).json({
                    message: "Sucess",
                    user: user,
                });
            } else {
                res.status(200).json({
                    message: "No Record found",
                });
            }
        }

    }
}

module.exports = UsersController;