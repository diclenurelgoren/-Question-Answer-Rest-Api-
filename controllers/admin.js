const User = require("../models/user");
const asyncerrorwrapper = require("express-async-handler");

const blockUser = asyncerrorwrapper(async (req, res, next) => {

    const { id } = req.params;

    const user = await User.findById(id);

    if (user.blocked === "false") {
        user.blocked = "true";
    }
    else {
        user.blocked = "false";
    }
    // user.blocked = !user.blocked;

    await user.save();

    return res.status(200)
        .json({
            success: true,
            message: "Block -Unblock Successful"
        });
});
const deleteUser = asyncerrorwrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    await user.remove();
    return res.status(200)
        .json({
            success: true,
            message: "Delete Operation Successful"
        });
});

module.exports = { blockUser, deleteUser };