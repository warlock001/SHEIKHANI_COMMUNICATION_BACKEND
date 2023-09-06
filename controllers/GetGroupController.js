const User = require("../models/user");


class GetGroupsController {
    static async Execute(req, res) {

        const { id } = req.query;

        if (id && id.match(/^[0-9a-fA-F]{24}$/)) {

            await User.findOne({
                _id: id
            }).populate({
                path: "groups",
            }).then(results => {
                res.status(200).json({
                    user: results,
                });
            })
        } else {
            res.status(400).json({
                message: `Invalid Request`,
            });
        }


    }

}


module.exports = GetGroupsController;