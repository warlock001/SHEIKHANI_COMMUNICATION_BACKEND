const Announcemnet = require("../models/announcemnet");

class GetDepartmentController {
    static async Execute(req, res) {

        const { id } = req.body;

        if (id) {
            await Announcemnet.find({ _id: id }).populate({
                path: "user",
            }).then(result => {
                res.status(200).json({
                    message: `Success`,
                    announcemnet: result
                });
            }).catch(err => {
                console.log(err)
            })
        } else {
            await Announcemnet.find().populate({
                path: "user",
            }).then(result => {
                res.status(200).json({
                    message: `Success`,
                    announcemnet: result
                });
            }).catch(err => {
                console.log(err)
            })
        }

    }

}

module.exports = GetDepartmentController;