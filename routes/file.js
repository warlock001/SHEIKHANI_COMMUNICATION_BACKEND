const filesRouter = require("express").Router();
const GetFiles = require("../controllers/GetFiles");

filesRouter.get("/files/:id/:client", async (req, res) => {
  GetFiles.Execute(req, res);
});

// filesRouter.delete("/files/:id", auth, async (req, res) => {
//   DeleteFile.Execute(req, res);
// });

module.exports = filesRouter;
