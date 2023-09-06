const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    roomid: {
        type: String,
        required: true
    },
},
    { timestamps: true },
);

module.exports = mongoose.model("Groups", groupSchema);
