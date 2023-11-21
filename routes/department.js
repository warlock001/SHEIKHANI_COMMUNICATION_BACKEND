
const GetDepartmentController = require("../controllers/GetDepartment");
const PostDepartmentController = require("../controllers/PostDepartment");
const PutDepartmentController = require("../controllers/PutDepartment");
const DeleteDepartmentController = require("../controllers/DeleteDepartment");
const departmentRouter = require("express").Router();


departmentRouter.get("/department", async (req, res) => {
    GetDepartmentController.Execute(req, res);
});


departmentRouter.post("/department", async (req, res) => {
    PostDepartmentController.Execute(req, res);
});


departmentRouter.put("/department", async (req, res) => {
    PutDepartmentController.Execute(req, res);
});

departmentRouter.delete("/department", async (req, res) => {
    DeleteDepartmentController.Execute(req, res);
});

module.exports = departmentRouter;
