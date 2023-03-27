const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/CustomError");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const rootdir = path.dirname(require.main.filename);
        cb(null, path.join(rootdir, "/public/uploads"));
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.split("/")[1];
        req.savedProfileImage = "image_" + req.user.id + "." + extension;
        cb(null, req.savedProfileImage);
    }
});

const fileFilter = (req, file, cb) => {
    let allowedMimeTypes = ["image/jpg", "image/png", "image/jpeg", "image/gif"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new CustomError("Please Provide a valid image file", 400), false);
    }
    return cb(null, true)
};

const profileImageUpload = multer({ storage: storage, fileFilter });

module.exports = profileImageUpload;