const Reel = require("../models/reel.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const ReelComment = require("../models/ReelComment.model");
const { model } = require("mongoose");

async function updateModerationStatus(contentType, contentId, status) {

    let Model;

    if(contentType === "reel"){
        Model=Reel;
    }else if(contentType === "post"){
        Model=Post;
    }else if (contentType === "reelComment") {
        Model = ReelComment;
    }else{
        throw new Error(`Unsupported content type : ${contentType}`);

    }

    const content =await Model.findByIdAndUpdate(
        contentId,
        {
            moderationStatus: status
        },
        {new: true}
    );

    if(!content){
        throw new Error(`${contentType}  not found`);
    }

    return content;
    
}

module.exports = {
    updateModerationStatus
};