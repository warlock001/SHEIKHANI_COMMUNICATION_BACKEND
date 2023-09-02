
const SetUserMessagesController = require("../controllers/SetUserMessages");
const GetUserMessagesController = require("../controllers/GetUserMessages");
const userMessageRouter = require("express").Router();


userMessageRouter.get("/setUserMessage", async (req, res) => {
    SetUserMessagesController.Execute(req, res);
});


userMessageRouter.get("/getUserMessage", async (req, res) => {
    GetUserMessagesController.Execute(req, res);
});

module.exports = userMessageRouter;
