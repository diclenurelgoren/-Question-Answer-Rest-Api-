const express = require("express");
const user = require("../models/user");
const router = express.Router();

const auth = require("./auth");
const question = require("./question");
const users = require("./user");
const admin = require("./admin");


router.use("/question", question);
router.use("/auth", auth);
router.use("/users", users);
router.use("/admin", admin);

module.exports = router;