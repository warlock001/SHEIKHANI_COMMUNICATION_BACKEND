const RecentChats = require("../models/recentChats");

class GetRecentMessagesController {
    static async Execute(req, res) {
        const { id } = req.query;

        if (!id) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
            RecentChats.find({
                user: id
            }).populate({
                path: "user",
            }).then(result => {
                res.status(200).json({
                    recentChats: result,
                });
            })
        }

    }

}

module.exports = GetRecentMessagesController;