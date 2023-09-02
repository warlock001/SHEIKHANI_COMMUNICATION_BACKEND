const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    senderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    roomid: {
        type: String,
        required: true
    },
    recieverid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
