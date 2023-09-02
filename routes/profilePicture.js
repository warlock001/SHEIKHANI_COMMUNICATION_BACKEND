const GetProfilePicture = require("../controllers/GetProfilePicture");
const UploadProfilePicture = require("../controllers/UploadProfilePicture");

const Router = require("express").Router();

module.exports = (upload) => {
  Router.post(
    "/profilePicture",
    upload.single("image"),
    async (req, res, next) => {
      UploadProfilePicture.Execute(req, res, next);
    }
  );

  Router.get("/profilepicture", async (req, res, next) => {
    GetProfilePicture.Execute(req, res, next);
  });

  return Router;
};
