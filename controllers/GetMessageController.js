const Message = require("../models/message");

class GetMessagesController {
    static async Execute(req, res) {
        const { roomid } = req.query;

        if (!roomid) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else {
            Message.find({ roomid: roomid }).then(results => {
                if (results.length == 0) {
                    res.status(404).json({
                        messages: "no messages found",
                    });
                } else {
                    res.status(200).json({
                        messages: results,
                    });
                }
            }).catch(err => {
                console.log(err)
                return res.status(400).send(err);
            })
        }
    }

}

module.exports = GetMessagesController;