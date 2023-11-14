const PasswordRouter = require("express").Router();
const SetPassword = require("../controllers/SetPassword")


PasswordRouter.post("/setPassword", async (req, res) => {
    SetPassword.Execute(req, res);
});



module.exports = PasswordRouter;