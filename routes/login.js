const LoginController = require("../controllers/LoginController");
const { body, validationResult } = require("express-validator");
const loginRouter = require("express").Router();

loginRouter.post(
    "/login",

    body("email").isEmail(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            LoginController.Execute(req, res);
        }
    }
);

module.exports = loginRouter;
