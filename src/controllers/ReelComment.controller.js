const ReelComment = require("../models/ReelComment.model");
const Reel = require("../models/reel.model");
const moderationQueue = require("../queues/moderation.queue");

async function createComment(req, res) {
    try {
        const { reelId } = req.params;
        const { content } = req.body;

        const userId = req.user._id;

        if (!content) {
            return res.status(400).json({
                message: "Comment content is required"
            });
        }

        const reel = await Reel.findById(reelId);

        if (!reel) {
            return res.status(404).json({
                message: "Reel not found"
            });
        }

        const Reelcomment = await ReelComment.create({
            content,
            user: userId,
            reel: reelId
        });

        await moderationQueue.add("moderateContent", {
            contentType: "reelComment",
            contentId: Reelcomment._id.toString()
        });
        return res.status(201).json({
            message: "Comment created successfully",
            Reelcomment
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function getComments(req, res) {
    try {
        const { reelId } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const reel = await Reel.findById(reelId);

        if (!reel) {
            return res.status(404).json({
                message: "Reel not found"
            });
        }

        const comments = await ReelComment.find({
            reel: reelId
        })
            .populate("user", "username fullName profilePicture")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments,
            page,
            limit
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}
async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;

        const comment = await ReelComment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to delete this comment"
            });
        }

        await ReelComment.findByIdAndDelete(commentId);

        return res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

module.exports = {
    createComment,getComments,deleteComment
};