const Department = require("../models/department");

class GetDepartmentController {
    static async Execute(req, res) {

        const { id } = req.query;

        if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
            Department.findOne({ _id: id }).then(result => {
                res.status(200).json({
                    department: result,
                });
            })
        } else {
            Department.find().then(result => {
                res.status(200).json({
                    department: result,
                });
            })
        }

    }
}

module.exports = GetDepartmentController;