const User = require("../../models/user");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");
const CustomEror = require("../../helpers/error/CustomError");
const asyncerrorwrapper = require("express-async-handler");

const checkUserExits = asyncerrorwrapper(async (req, res, next) => {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return next(new CustomEror("There is no such user with that id", 400));
    }

    next();
});
const checkQuestionExits = asyncerrorwrapper(async (req, res, next) => {

    const question_id = req.params.question_id || req.params.id;

    const question = await Question.findById(question_id);

    if (!question) {
        return next(new CustomEror("There is no such Question with that id", 400));
    }

    next();
});
const checkQuestionAnswerExits = asyncerrorwrapper(async (req, res, next) => {

    const answer_id = req.params.answer_id;
    const question_id = req.params.question_id;
    const answer = await Answer.findOne({
        _id: answer_id,
        question: question_id
    });

    if (!answer) {
        return next(new CustomEror("There is no answer with that id associated with question id", 400));
    }

    next();
});
module.exports = { checkUserExits, checkQuestionExits, checkQuestionAnswerExits };