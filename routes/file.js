const filesRouter = require("express").Router();
const GetFiles = require("../controllers/GetFiles");
const UploadFile = require("../controllers/UploadFile");

module.exports = (upload) => {
  filesRouter.get("/files/:id/:client", async (req, res) => {
    GetFiles.Execute(req, res);
  });


  filesRouter.post("/files",
    upload.single("image"),
    async (req, res) => {
      UploadFile.Execute(req, res);
    });
  // filesRouter.delete("/files/:id", auth, async (req, res) => {
  //   DeleteFile.Execute(req, res);
  // });

  return filesRouter;
};


