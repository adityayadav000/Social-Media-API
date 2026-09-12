const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        moderationStatus: {
    type: String,
    enum: ["pending", "approved", "hidden", "review"],
    default: "pending"
},

moderationCategory: {
    type: String,
    default: null
},

moderationReason: {
    type: String,
    default: null
},

moderationConfidence: {
    type: Number,
    default: null
},

    },
    {
        timestamps: true
    }
);

const Comment=mongoose.model("Comment", commentSchema);

module.exports=Comment;