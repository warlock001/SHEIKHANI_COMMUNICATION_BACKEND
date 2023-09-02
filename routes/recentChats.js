const GetRecentChats = require("../controllers/GetRecentChats");

const recentChatsRouter = require("express").Router();

recentChatsRouter.get("/recentChats", async (req, res) => {
    GetRecentChats.Execute(req, res);
});



module.exports = recentChatsRouter;
