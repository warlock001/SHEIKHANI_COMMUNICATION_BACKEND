const PostGroupMemberController = require("../controllers/PostGroupMemberController");


const groupMemberRouter = require("express").Router();

groupMemberRouter.post("/groupMember", async (req, res) => {
    PostGroupMemberController.Execute(req, res);
});

module.exports = groupMemberRouter;
