const express = require("express");
const router = express.Router();
const { auth, getUser, login, logout, ImageUpload, forgotpassword, resetpassword, editDetalies } = require("../controllers/auth.js");
const { accesstoroute } = require("../middleware/authorization/auth");
const profileImageUpload = require("../middleware/libraries/profileimageupload");

router.post("/register", auth);
router.post("/login", login);
router.post("/upload", [accesstoroute, profileImageUpload.single("profile_image")], ImageUpload);
router.get("/profile", accesstoroute, getUser);
router.get("/logout", logout);
router.post("/forgotpassword", forgotpassword);
router.put("/resetpassword", resetpassword);
router.put("/edit", accesstoroute, editDetalies);
module.exports = router;
