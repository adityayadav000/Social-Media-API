const mongoose =require("mongoose");

const postSchema= new mongoose.Schema(
    {
        content: {
            type: String,
            required:true,
            trim: true
        },

        owner: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
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

        likes: [

            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]

},
{
   timestamps: true
}
);

module.exports= mongoose.model("Post",  postSchema);