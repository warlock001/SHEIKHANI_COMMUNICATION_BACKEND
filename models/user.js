const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    countryCode: {
        type: String,
        required: false,
    },
    dialCode: {
        type: String,
        required: false,
    },
    mobile: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: false,
    },
    department: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
    },
    profilePicture: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "File",
            required: false,
        },
    ],
});

module.exports = mongoose.model("User", UserSchema);
