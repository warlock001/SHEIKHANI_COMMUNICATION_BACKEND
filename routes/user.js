const GetUsers = require("../controllers/GetUsers");
const userRouter = require("express").Router();

userRouter.get("/user", async (req, res) => {
    GetUsers.Execute(req, res);
});

module.exports = userRouter;
