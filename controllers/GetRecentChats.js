const RecentChats = require("../models/recentChats");

class GetRecentMessagesController {
    static async Execute(req, res) {
        const { id } = req.query;

        if (!id) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else {
            RecentChats.find({
                user: id
            }).then(result => {
                res.status(200).json({
                    recentChats: result,
                });
            })
        }

    }

}

module.exports = GetRecentMessagesController;