const GetUsers = require("../controllers/GetUsers");
const UpdateUser = require("../controllers/UpdateUser");
const userRouter = require("express").Router();

userRouter.get("/user", async (req, res) => {
    GetUsers.Execute(req, res);
});

userRouter.put("/user", async (req, res) => {
    UpdateUser.Execute(req, res);
});

module.exports = userRouter;
