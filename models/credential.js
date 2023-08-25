const mongoose = require("mongoose");

const credentialSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  OTP: {
    type: String,
    required: false,
  },
  publicKey: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("credential", credentialSchema);
