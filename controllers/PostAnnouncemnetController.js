const Announcemnet = require("../models/announcemnet");

class PostAnnouncementController {
    static async Execute(req, res) {


        const { id, title, description } = req.body;


        if (id && title && description && id.match(/^[0-9a-fA-F]{24}$/)) {



            var announcemnet = new Announcemnet({
                user: id,
                title: title,
                description: description
            })

            await announcemnet.save().then(result => {
                res.status(200).json({
                    message: `Announcement Saved Successfully`,
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

module.exports = PostAnnouncementController;