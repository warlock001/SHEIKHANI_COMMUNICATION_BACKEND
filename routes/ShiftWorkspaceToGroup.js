const ShiftWorkspaceToGroup = require("../controllers/ShiftWorkspaceToGroup");

const shiftWorkspaceRouter = require("express").Router();

shiftWorkspaceRouter.post("/shiftWorkspace", async (req, res) => {
    ShiftWorkspaceToGroup.Execute(req, res);
});



module.exports = shiftWorkspaceRouter;
