const Department = require("../models/department");

class DeleteDepartmentController {
    static async Execute(req, res) {

        const { id } = req.query;
        if (id && id.match(/^[0-9a-fA-F]{24}$/)) {

            await Department.findOneAndDelete({ _id: id }).then(result => {
                res.status(200).json({
                    message: `Department Deleted Successfully`,
                });
            }).catch(err => {
                return res.status(400).send(err);
            })

        } else {
            res.status(400).json({
                message: `Invalid Request`,
            });
        }
    }
}

module.exports = DeleteDepartmentController;