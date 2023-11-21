const Department = require("../models/department");

class PutDepartmentController {
    static async Execute(req, res) {

        const { id, title } = req.body;

        if (id && id.match(/^[0-9a-fA-F]{24}$/) && title && title != '') {

            await Department.findOneAndUpdate(
                { '_id': id },
                {
                    $set:
                    {
                        title: title
                    }
                }
            ).then(result => {
                res.status(200).json({
                    message: `Department Updated Successfully`,
                });
            }).catch(err => {
                console.log(err)
            })

        } else {
            res.status(400).json({
                message: `Invalid Request`,
            });
        }
    }
}
module.exports = PutDepartmentController;