const User = require("../models/user");
const Group = require("../models/group");


class GetGroupsController {
    static async Execute(req, res) {

        const { id, roomid } = req.query;

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
        } else if (roomid) {
            await Group.findOne({
                roomid: roomid
            }).populate({
                path: "members",
            }).then(result => {
                res.status(200).json({
                    group: result,
                });
            }).catch(err => {
                console.log(err)
                res.status(400).json({
                    message: err,
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