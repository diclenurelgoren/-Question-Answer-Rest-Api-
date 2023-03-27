const express = require("express");
const router = express.Router();
const { getSingleUser, getAllUsers } = require("../controllers/user");
const { checkUserExits } = require("../middleware/database/databaseErrorHelpers");
const userquesrymiddleware = require("../middleware/query/userQueryMiddleware");
const User = require("../models/user");
router.get("/:id", checkUserExits, getSingleUser);
router.get("/", userquesrymiddleware(User), getAllUsers);

module.exports = router;
