const PostGroupController = require("../controllers/PostGroupController");
const GetGroupController = require("../controllers/GetGroupController");

const groupRouter = require("express").Router();

groupRouter.post("/group", async (req, res) => {
    PostGroupController.Execute(req, res);
});

groupRouter.get("/group", async (req, res) => {
    GetGroupController.Execute(req, res);
});


module.exports = groupRouter;
