const SignupRouter = require("express").Router();
const { body, check, query, validationResult } = require("express-validator");

const SignupController = require("../controllers/SignUpController");

SignupRouter.post(
    "/signup",

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            SignupController.Execute(req, res);
        }
    }
);

module.exports = SignupRouter;
