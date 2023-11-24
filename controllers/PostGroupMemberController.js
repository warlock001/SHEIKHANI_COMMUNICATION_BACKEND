const User = require("../models/user");
const Group = require("../models/group");
const RecentChats = require("../models/recentChats");

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

            await Group.findOne({
                roomid: roomid
            }).then(async res => {
                id.forEach(id => {
                    if (!res.members.includes(id)) {
                        res.members.push(id)
                    }
                })
                await Group.findOneAndUpdate(
                    { roomid: roomid },
                    {
                        members: res.members
                    }
                )
            })


            RecentChats.find({ user: id }).then(async results => {

                const group = await Group.findOne({
                    roomid: roomid
                })

                if (results.length == 0) {

                    var recentChats = new RecentChats({
                        user: id,
                        groups: [{
                            user: roomid,
                            lastMessage: '',
                            title: group.title,
                            newMessages: 0,
                            time: new Date()
                        }]

                    })

                    await recentChats.save()

                } else {

                    var temp = results[0].groups
                    temp.push({
                        user: roomid,
                        lastMessage: '',
                        title: group.title,
                        newMessages: 0,
                        time: new Date()
                    })


                    RecentChats.findOneAndUpdate(
                        { _id: results._id },
                        {
                            $set: {
                                groups: temp
                            },
                        }
                    )



                }
            })






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