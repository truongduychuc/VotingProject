const multer = require('multer');

//UPLOAD AVATAR
const storage = multer.diskStorage({
  destination: (res, file, cb) => {
    cb(null, './uploads/avatars/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
const fileFilter = (req, file, cb) => {
  //validate image type
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
module.exports = upload;
