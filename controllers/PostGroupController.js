const Group = require("../models/group");
class GroupController {
    static async Execute(req, res) {

        const {
            title,
            id
        } = req.body;


        if (id && id.match(/^[0-9a-fA-F]{24}$/) && title) {

            const group = new Group({
                title: title,
                roomid: Date.now()
            })

            group.save().then(() => {
                res.status(200).json({
                    message: `Message Saved Successfully`,
                });
            }).catch(err => {
                return res.status(400).send(err);
            })

        } else {
            res.status(400).json({
                message: `Invalid Request`,
            });
        }

    }

}

module.exports = GroupController;