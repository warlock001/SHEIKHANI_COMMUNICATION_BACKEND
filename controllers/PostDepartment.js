const Department = require("../models/department");

class PostDepartmentController {
    static async Execute(req, res) {

        const { title } = req.body;

        if (title && title != '') {
            if (title.length > 20) {
                res.status(400).json({
                    message: `Title length Can't exceed 20 characters`,
                });
            } else {
                var department = new Department({
                    title: title
                })

                await department.save().then(() => {
                    res.status(200).json({
                        message: `Department Saved Successfully`,
                    });
                }).catch(err => {
                    return res.status(400).send(err);
                })
            }
        } else {
            res.status(400).json({
                message: `Invalid Request`,
            });
        }

    }
}

module.exports = PostDepartmentController;