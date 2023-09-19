const ShiftGroupToWorkspace = require("../controllers/ShiftGroupToWorkspace");

const shiftGroupRouter = require("express").Router();

shiftGroupRouter.post("/shiftGroup", async (req, res) => {
    ShiftGroupToWorkspace.Execute(req, res);
});



module.exports = shiftGroupRouter;
