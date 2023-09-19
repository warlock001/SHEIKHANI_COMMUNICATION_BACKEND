// const PostGroupController = require("../controllers/PostGroupController");
const GetWorkspaceController = require("../controllers/GetWorkspaceController");

const workspaceRouter = require("express").Router();

// workspaceRouter.post("/workspace", async (req, res) => {
//     PostGroupController.Execute(req, res);
// });

workspaceRouter.get("/workspace", async (req, res) => {
    GetWorkspaceController.Execute(req, res);
});


module.exports = workspaceRouter;
