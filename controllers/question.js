const Question = require("../models/Question");
const CustomEror = require("../helpers/error/CustomError");
const asyncerrorwrapper = require("express-async-handler");
const user = require("../models/user");


const askQuestion = asyncerrorwrapper(async (req, res, next) => {

    const information = req.body;

    const question = await Question.create({ ...information, user: req.user.id });

    res.status(200).json({
        success: true,
        data: question
    });
});
const getAllQuestion = asyncerrorwrapper(async (req, res, next) => {

    return res.status(200).json(res.queryResult);
});
const getSingleQuestion = asyncerrorwrapper(async (req, res, next) => {

    return res.status(200).json(res.queryResult);
});
const editSingleQuestion = asyncerrorwrapper(async (req, res, next) => {
    const { id } = req.params;

    const { title, content } = req.body;

    let question = await Question.findById(id);

    question.title = title;
    question.content = content;
    question = await question.save();

    return res.status(200).json({
        success: true,
        data: question
    });
});
const deleteQuestion = asyncerrorwrapper(async (req, res, next) => {
    const { id } = req.params;


    const question = await Question.findByIdAndDelete(id);

    return res.status(200).json({
        success: true,
        message: "Question Delete Sucessfull"
    });
});
const likeQuestion = asyncerrorwrapper(async (req, res, next) => {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (question.likes.includes(req.user.id)) {
        return next(new CustomEror("You already liked this question", 400));
    }

    question.likes.push(req.user.id);
    question.likeCount = question.like.length;
    await question.save();

    return res.status(200).json({
        success: true,
        data: question
    });
});
const undoLikeQuestion = asyncerrorwrapper(async (req, res, next) => {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question.likes.includes(req.user.id)) {
        return next(new CustomEror("You Can undo like oparation for this question", 400));
    }

    const index = question.likes.indexOf();
    question.likes.splice(index, 1);
    question.likeCount = question.like.length;
    await question.save();

    return res.status(200).json({
        success: true,
        data: question
    });
});

module.exports = {
    askQuestion,
    getAllQuestion,
    getSingleQuestion,
    editSingleQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
};