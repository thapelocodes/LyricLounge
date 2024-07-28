const mutler = require("multer");
const path = require("path");

//Storage configuration for Multer
const storage = mutler.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/")); // Destination folder for storing images
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`); // Filename format
  },
});

// File filter for acceptable file types
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
};

// Multer configuration
const upload = mutler({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
