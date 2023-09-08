const User = require("../models/user");
const Group = require("../models/group");

class GroupMemberController {
    static async Execute(req, res) {

        const {
            id,
            roomid
        } = req.body;

        if (id && Array.isArray(id) && roomid) {

            id.forEach(async id => {

                const user = await User.findOne({
                    '_id': id
                })

                const group = await Group.findOne({
                    roomid: roomid
                })
                console.log(group)
                if (user) {

                    if (!user.groups.includes(group._id)) {
                        user.groups.push(group._id)
                    }


                    await User.findOneAndUpdate(
                        { '_id': id },
                        {
                            $set:
                            {
                                groups: user.groups
                            }
                        }
                    )
                }



            });
            res.status(200).json({
                message: `User Added Successfully`,
            });


        } else {
            res.status(400).json({
                message: `Invalid Request`,
            });
        }
    }

}

module.exports = GroupMemberController;