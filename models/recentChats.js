const mongoose = require("mongoose");

const recentChatsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    chats: {
        type: Array,
        required: true
    },
    groups: {
        type: Array,
        required: true
    },
},
    { timestamps: true },
);

module.exports = mongoose.model("RecentChats", recentChatsSchema);
