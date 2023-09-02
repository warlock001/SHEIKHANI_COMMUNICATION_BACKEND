const mongoose = require("mongoose");

const recentChatsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chats: {
        type: Array,
        required: true
    },
},
    { timestamps: true },
);

module.exports = mongoose.model("RecentChats", recentChatsSchema);
