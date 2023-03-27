const User = require("../models/user.js");
const CustomEror = require("../helpers/error/CustomError");
const asyncerrorwrapper = require("express-async-handler");
const { sendtojwtclient } = require("../helpers/authorization/tokenhelpers.js");
const { validateinputuser, comparepasswrod } = require("../helpers/authorization/inputhelpers");
const profileImageUpload = require("../middleware/libraries/profileimageupload.js");
const sendemail = require("../helpers/libraries/sendemail");


const auth = asyncerrorwrapper(async (req, res, next) => {


    const { name, email, password, role } = req.body;
    const user = await User.create({
        name, email, password, role
    });

    sendtojwtclient(user, res);

});
const login = asyncerrorwrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!validateinputuser(email, password)) {
        return next(new CustomEror("Please check your inputs", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!comparepasswrod(password, user.password)) {
        return next(new CustomEror("Please check your credentials", 400));
    }
    sendtojwtclient(user, res);

});
const logout = asyncerrorwrapper(async (req, res, next) => {
    const { NODE_ENV } = process.env;

    res.status(200)
        .cookie({
            httpOnly: true,
            expire: Date(Date.now),
            secure: NODE_ENV === "devoplement" ? false : true
        }).json({
            success: true,
            message: "LogOut Successfull"
        });

});
const ImageUpload = asyncerrorwrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        profile_image: req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    });

    res.status(200)
        .json({
            success: true,
            message: "Image Upload Succesfull",
            data: user
        });
});
const forgotpassword = asyncerrorwrapper(async (req, res, next) => {
    const resetEmail = req.body.email;

    const user = await User.findOne({ email: resetEmail });

    if (!user) {
        return next(new CustomEror("This is no user with that email", 400));
    }

    const resetpasswordtoken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetpasswordtoken=${resetpasswordtoken}`;

    const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p><a href='${resetPasswordUrl}' target='_blank'>LİNK</a>will expire in 1 hours </p>`;

    try {

        await sendemail({
            form: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate
        });
        return res
            .status(200)
            .json({
                success: true,
                message: "Token Sent To Email"
            });
    }
    catch (err) {
        user.resetpasswordToken = undefined;
        user.resetpasswordExpire = undefined;

        await user.save();
        return next(new CustomEror("Email Could Not Be Sent", 500));
    }
    console.log(res);
});
const getUser = (req, res, next) => {

    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    });
}
const resetpassword = asyncerrorwrapper(async (req, res, next) => {
    const { resetpasswordToken } = req.query;
    const { password } = req.body;

    if (!resetpasswordToken) {
        return next(new CustomEror("Please Provied a Token", 400));
    }

    let user = await User.findOne({
        resetpasswordToken: resetpasswordToken,
        resetpasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new CustomEror("Invalid Token or Session Expired", 400));
    }

    user.password = password;
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;

    return res.status(200)
        .json({
            success: true,
            message: "Reset Password Successful"
        });

});
const editDetalies = asyncerrorwrapper(async (req, res, next) => {
    const editInformaiton = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, editInformaiton, {
        new: true,
        runValidators: true
    });

    return res.status(200)
        .json({
            success: true,
            message: user
        });
})
module.exports = {
    auth,
    getUser,
    logout,
    login,
    ImageUpload,
    forgotpassword,
    resetpassword,
    editDetalies
};