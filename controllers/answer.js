const CustomEror = require("../helpers/error/CustomError");
const asyncerrorwrapper = require("express-async-handler");
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const User = require("../models/user");
const addNewQurstionAnswer = asyncerrorwrapper(async (req, res, next) => {
    const { question_id } = req.params;
    const user_id = req.user.id;

    const information = req.body;

    const answer = await Answer.create({
        ...information,
        user: user_id,
        question: question_id
    });
    return res.status(200).json({
        data: answer
    });
});
const getAllAnswers = asyncerrorwrapper(async (req, res, next) => {
    const { question_id } = req.params;
    const question = await Question.findById(question_id).populate({ path: 'answers', model: Answer });

    const answers = question.answers;
    return res.status(200).json({
        success: true,
        count: answers.length,
        data: answers
    });
});
const getSingleAnswer = asyncerrorwrapper(async (req, res, next) => {
    const { answer_id } = req.params;
    const answer = await Answer.findById(answer_id).populate({ path: 'user', select: "name profile_image", model: User })
        .populate({ path: 'question', select: "title", model: Question });

    return res.status(200).json({
        success: true,
        data: answer
    });
});
const editAnswer = asyncerrorwrapper(async (req, res, next) => {
    const { answer_id } = req.params;
    const { content } = req.body;
    const answer = await Answer.findById(answer_id);

    answer.content = content;

    await answer.save();
    return res.status(200).json({
        success: true,
        data: answer
    });
});
const deleteAnswer = asyncerrorwrapper(async (req, res, next) => {
    const { answer_id } = req.params;
    const { question_id } = req.params;

    await Answer.findByIdAndRemove(answer_id);

    const question = await Question.findById(question_id);
    question.answers.splice(question.answers.indexOf(answer_id, 1));
    question.answerCount = question.answers.length;
    await question.save();
    return res.status(200).json({
        success: true,
        message: "Answer Delete Succesfull"
    });
});
const likeAnswer = asyncerrorwrapper(async (req, res, next) => {
    const { answer_id } = req.params;

    const answer = await Answer.findById(answer_id);

    if (answer.likes.includes(req.user.id)) {
        return next(new CustomEror("You already liked this question", 400));
    }

    answer.likes.push(req.user.id);

    await answer.save();

    return res.status(200).json({
        success: true,
        data: answer
    });
});
const undolikeAnswer = asyncerrorwrapper(async (req, res, next) => {
    const { answer_id } = req.params;

    const answer = await Answer.findById(answer_id);

    if (!answer.likes.includes(req.user.id)) {
        return next(new CustomEror("You Can undo like oparation for this question", 400));
    }

    const index = answer.likes.indexOf();
    answer.likes.splice(index, 1);

    await answer.save();

    return res.status(200).json({
        success: true,
        data: answer
    });
});
module.exports = {
    addNewQurstionAnswer, getAllAnswers, getSingleAnswer, editAnswer, deleteAnswer,
    undolikeAnswer, likeAnswer
};