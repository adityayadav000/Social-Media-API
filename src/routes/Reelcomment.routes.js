const express = require("express");
const router = express.Router();

const {createComment, getComments, deleteComment} = require("../controllers/ReelComment.controller");

const verifyJWT = require("../middleware/auth.middleware");

router.post(
    "/:reelId/comment",
    verifyJWT,
    createComment
);

router.get(
    "/:reelId/comments",
    verifyJWT,
    getComments
);

router.delete(
    "/comments/:commentId",
    verifyJWT,
    deleteComment
);

module.exports = router;