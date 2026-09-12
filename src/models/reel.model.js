const mongoose =require ("mongoose");

const reelSchema=new mongoose.Schema(

    {
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        videoUrl:{
            type: String,
            required :true

        },

        caption: {
            type: String,
            default: ""
        },

        views:{
            type: Number,
            default: 0
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

        likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

reelSchema.index({
    owner: 1,
    createdAt: -1
});



module.exports=mongoose.model("Reel", reelSchema);