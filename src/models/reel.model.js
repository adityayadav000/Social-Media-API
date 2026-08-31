const mongoose =require ("mongoose");
const { createStandardJSONSchemaMethod } = require("zod/v4/core");

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