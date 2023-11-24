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
                                    let tempChat = chat.workspace.filter(obj => obj.user == roomid);
                                    if (chat.group) {
                                        chat.group.push(tempChat[0])
                                    } else {
                                        chat.group = [tempChat[0]]
                                    }
                                    chat.workspace = chat.workspace.filter(obj => obj.user !== roomid);

                                    await RecentChats.findOneAndUpdate(
                                        { 'user': member },
                                        {
                                            $set:
                                            {
                                                workspace: chat.workspace,
                                                group: chat.group
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