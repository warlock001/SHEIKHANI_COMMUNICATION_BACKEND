const User = require("../models/user");

class GetUserMessagesController {
    static async Execute(req, res) {
        const { id } = req.query;
        if (!id) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
            User.find({ _id: id }).then(result => {
                res.status(200).json({
                    messages: result.allMessages,
                });
            }).catch(err => {
                console.log(err)
                return res.status(400).send(err);
            })
        }
    }

}

module.exports = GetUserMessagesController;