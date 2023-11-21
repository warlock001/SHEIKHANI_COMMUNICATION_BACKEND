const Workspace = require("../models/workspace");
const RecentChats = require("../models/recentChats");

class PostWorkspaceController {
    static async Execute(req, res) {

        const { title, members } = req.body;

        if (!title || !members) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else {

            const workspace = new Workspace({
                title: title,
                roomid: Date.now(),
                members: members
            })

            await workspace.save().then(response => {

                members.forEach(user => {
                    RecentChats.findOne({ user: user }).then(async (chat) => {

                        if (chat) {
                            if (chat && chat.workspaces) {
                                chat.workspace.push({
                                    user: response.roomid,
                                    title: title,
                                    lastMessage: '',
                                    newMessages: 0,
                                    time: new Date()
                                })
                            } else {
                                chat.workspace = [{
                                    user: response.roomid,
                                    title: title,
                                    lastMessage: '',
                                    newMessages: 0,
                                    time: new Date()
                                }]
                            }

                            await RecentChats.findOneAndUpdate(
                                { 'user': user },
                                {
                                    $set:
                                    {
                                        workspaces: chat.workspaces
                                    }
                                })

                        } else {
                            const recentChats = new RecentChats({
                                user: user,
                                workspaces: [{
                                    user: response.roomid,
                                    title: title,
                                    lastMessage: '',
                                    newMessages: 0,
                                    time: new Date()
                                }]

                            })

                            await recentChats.save()
                        }

                    })
                });




                res.status(200).json({
                    message: `Added workspace successfully`,
                });
            }).catch(err => {
                return res.status(400).send(err);
            })

        }
    }

}

module.exports = PostWorkspaceController;