const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    senderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: false
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
        required: false
    },
    seen: {
        type: Boolean,
        require: true
    },
    delivered: {
        type: Boolean,
        require: true
    },
    isPicture: {
        type: Boolean,
        required: false,
        default: false
    },
    tags: {
        type: Array,
        default: [],
        required: false
    }
},
    { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
