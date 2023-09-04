const User = require("../models/user");
const Message = require("../models/message");

class MessagesController {
    static async Execute(req, res) {

        const {
            senderid,
            message,
            roomid,
            recieverid
        } = req.body;
        console.log("New Message - ", message)
        if (!senderid ||
            !message ||
            !roomid ||
            !recieverid) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else {
            const messageObj = new Message({
                senderid,
                message,
                roomid,
                recieverid,
                seen: false,
                delivered: false,
            });

            messageObj.save().then(response => {
                res.status(200).json({
                    message: `Message Saved Successfully`,
                    id: response._id
                });

            }).catch((err) => {
                return res.status(400).send(err, response);
            })
        }

    }
}

module.exports = MessagesController;