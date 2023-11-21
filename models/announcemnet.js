const mongoose = require("mongoose");

const announcementSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

},
    { timestamps: true },
);

module.exports = mongoose.model("announcement", announcementSchema);
