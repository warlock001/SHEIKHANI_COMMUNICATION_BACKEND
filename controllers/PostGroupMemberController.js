const User = require("../models/user");
const Group = require("../models/group");

class GroupMemberController {
    static async Execute(req, res) {

        const {
            id,
            roomid
        } = req.body;

        if (id && id.match(/^[0-9a-fA-F]{24}$/) && roomid) {

            const user = await User.findOne({
                '_id': id
            })

            const group = Group.findOne({
                roomid: roomid
            })

            user.groups.push(group._id)

            await User.findOneAndUpdate(
                { '_id': id },
                {
                    $set:
                    {
                        groups: user.groups
                    }
                }
            ).then(response => {
                res.status(200).json({
                    message: `User Added Successfully`,
                });
            })
        } else {
            res.status(400).json({
                message: `Invalid Request`,
            });
        }
    }

}

module.exports = GroupMemberController;