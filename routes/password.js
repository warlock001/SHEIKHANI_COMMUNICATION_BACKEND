const UpdatePassword = require("../controllers/UpdatePassword");

const passwordRouter = require("express").Router();

passwordRouter.put("/password", async (req, res) => {
    UpdatePassword.Execute(req, res);
});



module.exports = passwordRouter;
