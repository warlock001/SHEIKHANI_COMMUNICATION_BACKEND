const { response } = require("express");
const Message = require("../models/message");
const User = require("../models/user");

class SetUserMessagesController {
    static async Execute(req, res) {
        const { id, fuserid, lastmessage, roomid } = req.query;

        User.fndOne({ _id: id }).then(async result => {
            result.allMessages.map(item => {
                if (item.fuserid == fuserid) {
                    result.allMessages.pull(item.fuserid)
                }
            })

            const date = Date.now()

            result.allMessages.push([
                id,
                fuserid,
                lastmessage,
                roomid,
                date
            ])

            await result.save().then(response => {
                res.status(200).json({
                    messages: 'message saved successfully',
                });
            }).catch(err => {
                console.log(err)
                return res.status(400).send(err);
            })

        }).catch(err => {
            console.log(err)
            return res.status(400).send(err);
        })
    }
}

module.exports = SetUserMessagesController;