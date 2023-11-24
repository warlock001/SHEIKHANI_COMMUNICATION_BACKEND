// SET STORAGE

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = req.route.path;
    cb(null, `.${req.route.path}`);
    //cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

module.exports = upload;
