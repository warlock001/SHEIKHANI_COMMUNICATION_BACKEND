const PostGroupController = require("../controllers/PostGroupController");

const groupRouter = require("express").Router();

groupRouter.post("/group", async (req, res) => {
    PostGroupController.Execute(req, res);
});



module.exports = groupRouter;
