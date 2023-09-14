const User = require("../models/user");
const Message = require("../models/message");

class MessagesController {
    static async Execute(req, res) {

        const {
            senderid,
            message,
            roomid,
            recieverid,
            title,
            isPicture,
            tags
        } = req.body;
        console.log("New Message - ", message)
        if (!senderid ||
            !message ||
            !roomid) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else {
            const messageObj = new Message({
                senderid,
                message,
                title,
                roomid,
                recieverid,
                seen: false,
                delivered: false,
                isPicture: isPicture,
                tags: tags
            });

            messageObj.save().then(response => {
                res.status(200).json({
                    message: `Message Saved Successfully`,
                    id: response._id
                });

            }).catch((err) => {
                console.log(err)
                return res.status(400).send(err);
            })
        }

    }
}

module.exports = MessagesController;