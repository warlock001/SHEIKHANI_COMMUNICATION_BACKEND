const User = require("../models/user");

class UsersController {
    static async Execute(req, res) {

        const { id, department, query } = req.query;
        console.log(department)
        if (department != undefined && id != undefined && id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log(query)
            console.log(department)
            if (query != '') {
                console.log("first")
                var user = await User.find({
                    "_id": { $ne: id },
                    department: department,
                    firstName: { $regex: '.*' + query + '.*', $options: 'i' },

                }).limit(5);
            } else {
                console.log(id)
                var user = await User.find({
                    "_id": { $ne: id },
                    department: department,
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

        } else if (id != undefined && id.match(/^[0-9a-fA-F]{24}$/)) {
            var user = await User.findOne({
                '_id': id
            })

            if (user) {
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