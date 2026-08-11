const Post = require("../models/post.model");

async function createPost(req, res) {

    try {

        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Content is required"
            });
        }

        const post = await Post.create({
            content,
            owner: req.user._id
        });

        return res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });

    }

}

async function getAllPosts(req,res){
    try{
        const posts=await Post.find()
        .populate("owner", "fullName username email");

        return res.status(200).json({
            message: "posts fetched successfully",
            posts
        });
    } catch (error){
        console.log (error);

        return res.status(500).json({
            messsage: "something went wrong"
        })
    }
}
async function deletePost(req,res) {
    try{

    const { postId }=req.params;
    const post=await Post.findById(postId);

    if (!post) {
    return res.status(404).json({
        message: "Post not found"
    });
}

    if(post.owner.toString() !== req.user._id.toString()){
         return res.status(403).json({
                message: "you are not allowed to delete this post"
            });
    }

    await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            message: "Post deleted successfully"
        });

} catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });

    }
}
async function updatePost(req,res){
    try{
        const {postId}=req.params;
        const { content }= req.body;

        const post=await Post.findById(postId);

    if (!post) {
    return res.status(404).json({
        message: "Post not found"
    });
}

 if(post.owner.toString() !== req.user._id.toString()){
         return res.status(403).json({
                message: "you are not allowed to update this post"
            });
    }

    post.content=content;
    await post.save();

    return res.status(200).json({
    message: "Post updated successfully",
    post
});

    }catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function getPost(req, res) {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.status(200).json({
            post
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function likePost(req, res) {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }
        await Post.findByIdAndUpdate(
            postId,
            {
                $addToSet: {
                    likes: req.user._id
                }
            },
            {new: true}
        );
        return res.status(200).json({
            message: "Post liked successfully"
        });
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function unlikePost(req, res) {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

    await Post.findByIdAndUpdate(
        postId,
        {
            $pull:{
                likes:req.user._id
            }
        }
    );

     return res.status(200).json({
            message: "Post unliked successfully"
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

module.exports = {
    createPost,getAllPosts,deletePost,updatePost,getPost,likePost,unlikePost
};