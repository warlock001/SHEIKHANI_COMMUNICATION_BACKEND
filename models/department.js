const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
},
    { timestamps: true },
);

module.exports = mongoose.model("Department", departmentSchema);
