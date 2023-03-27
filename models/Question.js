const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const { Schema } = mongoose;

const QuestionShecema = new Schema({

    title: {
        type: String,
        required: [true, "Please Provied a title"],
        minlength: [10, "Please Provied a title at least 10 characters"],
        unique: true
    },
    content: {
        type: String,
        required: [true, "Please Provied a content"],
        minlength: [20, "Please Provied a title at least 20 characters"]
    },
    slug: String,

    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    answers: [{
        type: mongoose.Schema.ObjectId,
        ref: "Answers"
    }],
    answerCount: {
        type: Number,
        default: 0
    }
});

QuestionShecema.pre("save", function (next) {

    if (!this.isModified("title")) {
        next();
    }
    this.slug = this.makeSlug();
    next();

});
QuestionShecema.methods.makeSlug = function () {
    return slugify(this.title, {
        replacement: "-",
        remove: null,
        lower: true
    })
}
module.exports = mongoose.model("Question", QuestionShecema);
