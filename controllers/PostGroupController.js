const Group = require("../models/group");
const User = require("../models/user");


class GroupController {
    static async Execute(req, res) {

        const {
            title,
            id
        } = req.body;


        if (id && id.match(/^[0-9a-fA-F]{24}$/) && title) {

            const group = new Group({
                title: title,
                roomid: Date.now()
            })

            group.save().then(async (response) => {

                const user = await User.findOne({
                    '_id': id
                })
                console.log(user)
                user.groups.push(response._id)

                console.log(user)

                await User.findOneAndUpdate(
                    { '_id': id },
                    {
                        $set:
                        {
                            groups: user.groups
                        }
                    }
                ).catch(err => {
                    console.log(err)
                })

                res.status(200).json({
                    message: `Message Saved Successfully`,
                });


            }).catch(err => {
                console.log(err)
                return res.status(400).send(err);
            })

        } else {
            res.status(400).json({
                message: `Invalid Request`,
            });
        }

    }

}

module.exports = GroupController;