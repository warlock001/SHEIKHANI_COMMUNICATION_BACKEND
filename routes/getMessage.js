
const GetMessageController = require("../controllers/GetMessageController");
const getMessagesRouter = require("express").Router();


getMessagesRouter.get("/getMessage", async (req, res) => {
    GetMessageController.Execute(req, res);
});

module.exports = getMessagesRouter;
