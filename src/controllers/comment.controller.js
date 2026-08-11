const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

async function createComment(req, res) {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Comment  is required"
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = await Comment.create({
            content,
            user: req.user._id,
            post: postId
        });

        return res.status(201).json({
            message: "Comment created successfully",
            comment
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function getComments(req,res){

    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comments=await Comment.find({
            post:postId
        }).populate("user", "username fullname");

        return res.status(200).json({
            message: "comments fetched successfully",
            comments
        })

    }    catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}
async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

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

        await Comment.findByIdAndDelete(commentId);

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
    createComment,getComments, deleteComment
};