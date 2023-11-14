const PostUserDump = require("../controllers/PostUserDump");
const userDumpRouter = require("express").Router();


userDumpRouter.post("/userdump", async (req, res) => {
    PostUserDump.Execute(req, res);
});

module.exports = userDumpRouter;
