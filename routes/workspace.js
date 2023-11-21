const PostWorkspace = require("../controllers/PostWorkspace");
const GetWorkspaceController = require("../controllers/GetWorkspaceController");

const workspaceRouter = require("express").Router();

workspaceRouter.get("/workspace", async (req, res) => {
    GetWorkspaceController.Execute(req, res);
});

workspaceRouter.post("/workspace", async (req, res) => {
    PostWorkspace.Execute(req, res);
});


module.exports = workspaceRouter;
