const { Worker,  UnrecoverableError }= require("bullmq");
const redisClient = require("../config/redis");
 const Reel = require("../models/reel.model");
 const Post = require("../models/post.model");
 const Comment = require("../models/comment.model");
const ReelComment = require("../models/ReelComment.model");
const connectDB = require("../config/db");
require("dotenv").config();
const { moderateContent } = require("../services/ai/moderation2.service");

const {
    updateModerationStatus
} = require("../services/moderation.service");


connectDB();

const moderationWorker=new Worker(
    "moderation",

    async function (job) {

        console.log("moderation worker started processing job");
        console.log("Job name:", job.name);
        console.log("Job data:", job.data );

        const { contentType, contentId }=job.data;

//Job->reelId->MongoDB->Reel->caption + owner + status
       
        let content;

if (contentType === "reel") {
    content = await Reel.findById(contentId);
} else if (contentType === "post") {
    content = await Post.findById(contentId);
} else if (contentType === "comment") {
    content = await Comment.findById(contentId);
} else if (contentType === "reelComment") {
    content = await ReelComment.findById(contentId);
} else {
    throw new Error(`Unsupported content type: ${contentType}`);
}
const text = contentType === "reel"
     ? content.caption
    : content.content;

console.log("content text:", text);
console.log("moderation status:", content.moderationStatus);

console.log("moderating content:", contentId);
        
        let result;
    try{
        result=await moderateContent(text);
        } catch(error){
             if(error.retryable === false){
            throw new UnrecoverableError(error.message);
    }
            throw error;
}
console.log("AI moderation result:", result);

content.moderationCategory = result.category;
content.moderationConfidence = result.confidence;
content.moderationReason = result.reason;

await content.save();

const decision= result.decision;

console.log("Moderation decision:", decision);

await updateModerationStatus(
    contentType,
    contentId,
    decision
);
     
    },
    {
        connection: redisClient
    }
);

moderationWorker.on("completed", function(job){
    console.log(`moderation job ${job.id} completed`);

});

moderationWorker.on ("failed", function(job,error){

    console.log(`Moderation job ${job.id} failed`);
    console.log(error.message);
});


module.exports=moderationWorker;