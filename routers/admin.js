const express = require("express");
const { accesstoroute, getAdminAccess } = require("../middleware/authorization/auth");
const { blockUser, deleteUser } = require("../controllers/admin");
const { checkUserExits } = require("../middleware/database/databaseErrorHelpers");
const router = express.Router();

router.use([accesstoroute, getAdminAccess]);
router.get("/block/:id", checkUserExits, blockUser);
router.delete("/user/:id", checkUserExits, deleteUser);


module.exports = router;