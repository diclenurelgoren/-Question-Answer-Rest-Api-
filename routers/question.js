const express = require("express");
const router = express.Router();
const { checkQuestionExits, checkUserExits } = require("../middleware/database/databaseErrorHelpers");
const { undoLikeQuestion, likeQuestion, deleteQuestion, editSingleQuestion, getSingleQuestion, askQuestion, getAllQuestion } = require("../controllers/question.js");
const { accesstoroute, getQuestionOwnerAccess } = require("../middleware/authorization/auth");
const questionquesrymiddleware = require("../middleware/query/queryQuestionMiddleware");
const answerquesrymiddleware = require("../middleware/query/answerQueryMiddleware");
const Question = require("../models/Question");
const user = require("../models/user");
const answer = require("../models/Answer");

router.use("/:question_id/answer", checkQuestionExits, answer);
router.post("/ask", accesstoroute, askQuestion);
router.get("/", questionquesrymiddleware(Question, {
    population: {
        path: "user",
        select: "name profile_image",
        model: user
    }
}), getAllQuestion);
router.get("/:id/like", [accesstoroute, checkQuestionExits], likeQuestion);
router.get("/:id", checkQuestionExits, answerquesrymiddleware(Question, {
    population: [
        {
            path: "user",
            select: "name profile_image",
            model: user
        },
        {
            path: "answers",
            select: "content",
            model: answer
        }
    ]
}), getSingleQuestion);
router.get("/:id/undolike", [accesstoroute, checkQuestionExits], undoLikeQuestion);
router.put("/:id/edit", [accesstoroute, checkQuestionExits, getQuestionOwnerAccess], editSingleQuestion);
router.delete("/:id/delete", [accesstoroute, checkQuestionExits, getQuestionOwnerAccess], deleteQuestion);


module.exports = router;
