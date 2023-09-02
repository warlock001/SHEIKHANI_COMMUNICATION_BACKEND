const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  contentType: {
    required: true,
    type: String,
  },
  file: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
  docOF: {
    required: true,
    type: String,
  },
});

const File = mongoose.model("File", FileSchema);

module.exports = File;
