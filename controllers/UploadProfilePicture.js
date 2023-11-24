const User = require("../models/user");
const File = require("../models/file");

class UploadProfilePictureController {
  static async Execute(req, res) {
    const { id } = req.body;
    if (!id || !req.file) {
      res.status(200).json({
        message: "No Record found",
      });
    } else {
      var final_file = {
        file: req.file.filename,
        contentType: req.file.mimetype,
        docOF: req.route.path,
      };

      File.create(final_file)
        .then((result) => {
          User.findOneAndUpdate(
            { _id: id },
            {
              $set: {
                profilePicture: result._id,
              },
            }
          )
            .then((response) => {
              res.status(200).json({
                message: response,
                id: result._id
              });
            })
            .catch((err) => {
              res.status(400).send({
                message: err,
              });
            });
        })
        .catch((err) => {
          res.status(400).send({
            message: err,
          });
        });
    }
  }
}

module.exports = UploadProfilePictureController;
