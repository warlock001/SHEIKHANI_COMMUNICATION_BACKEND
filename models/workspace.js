const mongoose = require("mongoose");

const workspaceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    roomid: {
        type: String,
        required: true,
        unique: true,
    },
    lastMessage: {
        type: String,
        required: false
    },
    members: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
        required: false
    }
},
    { timestamps: true },
);

module.exports = mongoose.model("Workspace", workspaceSchema);
