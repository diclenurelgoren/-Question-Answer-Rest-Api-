const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const { Schema } = mongoose;
const Question = require("./Question");
const AnswerShecema = new Schema({
    content: {
        type: String,
        required: [true, "Please Provied a content"],
        minlength: [10, "Please Provied a title at least 20 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    question: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Question"
    }

});

AnswerShecema.pre("save", async function (next) {

    if (!this.isModified("user")) return next();

    try {
        const question = await Question.findById(this.question)

        question.answers.push(this._id);
        question.answerCount = question.answers.length;
        await question.save();
        next();
    }
    catch (err) {
        return next(err);
    }
})

module.exports = mongoose.model("Answer", AnswerShecema);
