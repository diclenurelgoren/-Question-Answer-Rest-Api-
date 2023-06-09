const express = require("express");
const router = express.Router({ mergeParams: true });
const { accesstoroute } = require("../middleware/authorization/auth");
const { checkQuestionAnswerExits } = require("../middleware/database/databaseErrorHelpers");
const { addNewQurstionAnswer, getAllAnswers, getSingleAnswer, editAnswer, deleteAnswer, likeAnswer, undolikeAnswer } = require("../controllers/answer");
const { getAnswerOwnerAccess } = require("../middleware/authorization/auth");
router.post("/", accesstoroute, addNewQurstionAnswer);
router.get("/", getAllAnswers);
router.get("/:answer_id", checkQuestionAnswerExits, getSingleAnswer);
router.put("/:answer_id/edit", [checkQuestionAnswerExits, accesstoroute, getAnswerOwnerAccess], editAnswer);
router.delete("/:answer_id/delete", [checkQuestionAnswerExits, accesstoroute, getAnswerOwnerAccess], deleteAnswer);
router.get("/:answer_id/like", [checkQuestionAnswerExits, accesstoroute], likeAnswer);
router.get("/:answer_id/undolike", [checkQuestionAnswerExits, accesstoroute], undolikeAnswer);
module.exports = router;