const User = require("../models/user.js");
const CustomEror = require("../helpers/error/CustomError");
const asyncerrorwrapper = require("express-async-handler");

const getSingleUser = asyncerrorwrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    res.status(200)
        .json({
            success: true,
            data: user
        })
});
const getAllUsers = asyncerrorwrapper(async (req, res, next) => {

    const user = await User.find();

    res.status(200)
        .json(res.queryResult);
});

module.exports = { getSingleUser, getAllUsers };