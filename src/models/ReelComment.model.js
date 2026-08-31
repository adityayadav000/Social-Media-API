const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        reel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reel",
            required: true
        }
    },
    {
        timestamps: true
    }
);

commentSchema.index({
    reel: 1,
    createdAt: -1
});

module.exports = mongoose.model("ReelComment", commentSchema);