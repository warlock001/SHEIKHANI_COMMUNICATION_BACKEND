const Workspace = require("../models/workspace");
const Group = require("../models/group");
const RecentChats = require("../models/recentChats");


class ShiftWorkspaceController {
    static async Execute(req, res) {

        const { roomid } = req.body;
        if (!roomid) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else {

            await Group.findOne({ roomid: roomid }).then(async result => {
                if (result) {
                    const workspace = new Workspace({
                        title: result.title,
                        roomid: result.roomid,
                        lastMessage: result.lastMessage,
                        members: result.members
                    })

                    await workspace.save().then(response => {

                        Group.findOneAndDelete({ roomid: roomid }).then(response => {

                            result.members.forEach(member => {
                                RecentChats.findOne({ user: member }).then(async chat => {
                                    let tempChat = chat.groups.filter(obj => obj.user == roomid);
                                    if (chat.workspaces) {
                                        chat.workspaces.push(tempChat[0])
                                    } else {
                                        chat.workspaces = [tempChat[0]]
                                    }
                                    chat.groups = chat.groups.filter(obj => obj.user !== roomid);

                                    await RecentChats.findOneAndUpdate(
                                        { 'user': member },
                                        {
                                            $set:
                                            {
                                                groups: chat.groups,
                                                workspaces: chat.workspaces
                                            }
                                        })


                                })
                            })

                            res.status(200).json({
                                message: `Group shifted to workspace successfully`,
                            });
                        }).catch(err => {
                            return res.status(400).send(err);
                        })

                    }).catch(err => {
                        return res.status(400).send(err);
                    })

                } else {
                    return res.status(400).send("No Groups Found");
                }


            }).catch(err => {
                return res.status(400).send(err);
            })

        }

    }
}


module.exports = ShiftWorkspaceController;