const File = require("../models/file");


class UploadFileController {
    static async Execute(req, res) {
        if (!req.file) {
            res.status(400).send({
                message: "Invalid request",
            });
        } else {
            var final_file = {
                file: req.file.filename,
                contentType: req.file.mimetype,
                docOF: req.route.path,
            };

            File.create(final_file).then(result => {
                res.status(200).json({
                    message: 'File Saved Successfully',
                    id: result._id
                });
            }).catch(err => {
                res.status(400).send({
                    message: err,
                });
            })
        }
    }
}

module.exports = UploadFileController;