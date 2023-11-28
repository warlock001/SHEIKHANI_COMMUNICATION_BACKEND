const Group = require("../models/group");
const User = require("../models/user");
const RecentChats = require("../models/recentChats");


class GroupController {
    static async Execute(req, res) {

        const {
            title,
            id,
            members
        } = req.body;


        if (id && id.match(/^[0-9a-fA-F]{24}$/) && title) {

            const group = new Group({
                title: title,
                roomid: Date.now(),
                members: [id]
            })

            group.save().then(async (response) => {

                const user = await User.findOne({
                    '_id': id
                })
                user.groups.push(response._id)


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

                await RecentChats.find({ user: id }).then(async results => {
                    if (results.length == 0) {

                        const recentChats = new RecentChats({
                            user: id,
                            groups: [{
                                user: response.roomid,
                                lastMessage: '',
                                title: title,
                                newMessages: 0,
                                time: new Date()
                            }]
                        })

                        recentChats.save()

                    } else {

                        results[0].groups.push({
                            user: response.roomid,
                            lastMessage: '',
                            title: title,
                            newMessages: 0,
                            time: new Date()
                        })


                        await RecentChats.findOneAndUpdate(
                            { 'user': id },
                            {
                                $set:
                                {
                                    groups: results[0].groups
                                }
                            })

                    }
                })

                res.status(200).json({
                    message: `Message Saved Successfully`,
                });


            }).catch(err => {
                console.log(err)
                return res.status(400).send(err);
            })

        } else if (members) {


            const group = new Group({
                title: title,
                roomid: Date.now(),
                members: members
            })

            group.save().then(async (response) => {

                members.forEach(async id => {

                    const user = await User.findOne({
                        '_id': id
                    })
                    user.groups.push(response._id)


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

                    await RecentChats.find({ user: id }).then(async results => {
                        if (results.length == 0) {

                            const recentChats = new RecentChats({
                                user: id,
                                groups: [{
                                    user: response.roomid,
                                    lastMessage: '',
                                    title: title,
                                    newMessages: 0,
                                    time: new Date()
                                }]
                            })

                            recentChats.save()

                        } else {

                            results[0].groups.push({
                                user: response.roomid,
                                lastMessage: '',
                                title: title,
                                newMessages: 0,
                                time: new Date()
                            })


                            await RecentChats.findOneAndUpdate(
                                { 'user': id },
                                {
                                    $set:
                                    {
                                        groups: results[0].groups
                                    }
                                })

                        }
                    })



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