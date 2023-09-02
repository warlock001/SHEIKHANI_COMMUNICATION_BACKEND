
const GetRecentChats = require("../controllers/GetRecentChats");
const getRecentChatsRouter = require("express").Router();


getRecentChatsRouter.get("/getRecentChats", async (req, res) => {
    GetRecentChats.Execute(req, res);
});

module.exports = getRecentChatsRouter;
