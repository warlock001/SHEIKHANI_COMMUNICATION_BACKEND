const PostMessageController = require("../controllers/PostMessageController");

const saveMessageRouter = require("express").Router();

saveMessageRouter.post("/saveMessage", async (req, res) => {
    PostMessageController.Execute(req, res);
});



module.exports = saveMessageRouter;
