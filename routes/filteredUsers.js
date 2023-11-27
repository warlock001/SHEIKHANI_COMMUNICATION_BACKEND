
const GetFliteredUser = require("../controllers/GetFliteredUser");
const getFliteredUserRouter = require("express").Router();


getFliteredUserRouter.get("/filteredUser", async (req, res) => {
    GetFliteredUser.Execute(req, res);
});

module.exports = getFliteredUserRouter;
