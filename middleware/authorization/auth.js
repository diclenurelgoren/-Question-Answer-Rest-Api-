const CustomEror = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Question = require("../../models/Question");
const asyncerrorwrapper = require("express-async-handler");
const { IstokenIncluded, getAccessTokenFromHeader } = require("../../helpers/authorization/tokenhelpers");
const Answer = require("../../models/Answer");

const accesstoroute = (req, res, next) => {

    const { JWT_SECRET_KEY } = process.env;
    const accessToken = getAccessTokenFromHeader(req);
    if (!IstokenIncluded(req)) {
        return next(new CustomEror("You are not authorization to access this route"), 401);
    }

    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new CustomEror("You are not authorization to access this route"), 401);
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        };
        next();
    });
}

const getAdminAccess = asyncerrorwrapper(async (req, res, next) => {
    const { id } = req.user;

    const user = await User.findById(id);

    if (user.role !== "admin") {
        return next(new CustomEror("Only admin can access this route", 403));
    }
    next();
});
const getQuestionOwnerAccess = asyncerrorwrapper(async (req, res, next) => {
    const userid = req.user.id;
    const questionid = req.params.id;

    const question = await Question.findById(questionid);

    if (question.user != userid) {
        return next(new CustomEror("Only owner can handle this oparation", 403));
    }
    next();
});
const getAnswerOwnerAccess = asyncerrorwrapper(async (req, res, next) => {
    const userid = req.user.id;
    const answerid = req.params.answer_id;

    const answer = await Answer.findById(answerid);

    if (answer.user != userid) {
        return next(new CustomEror("Only owner can handle this oparation", 403));
    }
    next();
});
module.exports = {
    accesstoroute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
};