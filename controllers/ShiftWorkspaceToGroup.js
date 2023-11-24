const Workspace = require("../models/workspace");
const Group = require("../models/group");
const RecentChats = require("../models/recentChats");


class ShiftGroupController {
    static async Execute(req, res) {

        const { roomid } = req.body;
        if (!roomid) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else {

            await Workspace.findOne({ roomid: roomid }).then(async result => {
                if (result) {
                    const group = new Group({
                        title: result.title,
                        roomid: result.roomid,
                        lastMessage: result.lastMessage,
                        members: result.members
                    })

                    await group.save().then(response => {

                        Workspace.findOneAndDelete({ roomid: roomid }).then(response => {

                            result.members.forEach(member => {
                                RecentChats.findOne({ user: member }).then(async chat => {
                                    console.log((chat))
                                    let tempChat = chat.workspaces.filter(obj => obj.user == roomid);
                                    if (chat.groups) {
                                        chat.groups.push(tempChat[0])
                                    } else {
                                        chat.groups = [tempChat[0]]
                                    }
                                    chat.workspaces = chat.workspaces.filter(obj => obj.user !== roomid);

                                    await RecentChats.findOneAndUpdate(
                                        { 'user': member },
                                        {
                                            $set:
                                            {
                                                workspaces: chat.workspaces,
                                                groups: chat.groups
                                            }
                                        })


                                })
                            })

                            res.status(200).json({
                                message: `Workspace shifted to group successfully`,
                            });
                        }).catch(err => {
                            return res.status(400).send(err);
                        })

                    }).catch(err => {
                        return res.status(400).send(err);
                    })

                } else {
                    return res.status(400).send("No workspace Found");
                }


            }).catch(err => {
                return res.status(400).send(err);
            })

        }

    }
}


module.exports = ShiftGroupController;