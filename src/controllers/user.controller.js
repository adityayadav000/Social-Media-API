const bcrypt=require("bcrypt");
const User=require("../models/user.model");
const jwt=require("jsonwebtoken");
const Post = require("../models/post.model");

async function registerUser(req,res){
    try{
     const { fullName, username, email, password } = req.body;

      if (!fullName || !username || !email || !password) {
    return res.status(400).json({
        message: "All fields are required"
    });
}


     const hashedPassword=await bcrypt.hash(password,10);

    
const existingUser=await User.findOne({
    $or: [
        {email},
        {username}
    ]
})
   if (existingUser){
    return res.status(409).json({
        message: "username or email already exists"
    });
   }
    const user=await User.create({
        fullName,
        username,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        message: "user registered successfully",
        user
    });
}
 catch (error){
    console.log(error);

    return res.status(500).json({
        message: "something went wrong"
    });
}
}

async function loginUser(req,res){
    try {
        
        const { email, password } = req.body;
        
        if (!email || !password) {
    return res.status(400).json({
        message: "Email and password are required"
    });

}
    


    const user=await User.findOne({email});

    if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        

        const isPasswordCorrect=await bcrypt.compare(
            password,
            user.password
        );

         

        if (!isPasswordCorrect) {
    return res.status(401).json({
        message: "Invalid email or password"
    });
}

const token =jwt.sign ( 
{
    userId: user._id
},
process.env.JWT_SECRET,
{
    expiresIn: "1d"
}

);
 

    return res.status(200).json({
    message: "Login Successful",
    token
});



    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });

    }

}

async function followUser(req, res) {
    try {
        const { userId } = req.params;

        const currentUser = req.user;
        const userToFollow = await User.findById(userId);

        if (!userToFollow) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (currentUser._id.toString() === userId) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        if (currentUser.following.includes(userId)) {
            return res.status(400).json({
                message: "Already following this user"
            });
        }

        await User.findByIdAndUpdate(
            currentUser._id,
            {
                $addToSet: {
                    following: userId
                }
            }
        );

        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    followers: currentUser._id
                }
            }
        );

        return res.status(200).json({
            message: "User followed successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function unfollowUser(req, res) {
    try {
        const { userId } = req.params;

        const currentUser = req.user;
        const userToUnfollow = await User.findById(userId);

        if (!userToUnfollow) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await User.findByIdAndUpdate(
            currentUser._id,
            {
                $pull: {
                    following: userId
                }
            }
        );

        await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    followers: currentUser._id
                }
            }
        );

        return res.status(200).json({
            message: "User unfollowed successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function getUserProfile(req, res) {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .select("-password")
            .populate("followers", "username fullname profilePicture")
            .populate("following", "username fullname profilePicture");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function getFeed(req,res){
    try{
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;

        const skip=(page-1)*limit;


        const user=await User.findById(req.user._id);

        const posts=await Post.find({
            owner: { $in: user.following}
        })

        .populate("owner", "username fullname profilePicture")
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit);


        return res.status(200).json({
            message: "feed fetched successfully",
            posts,
            limit,
            posts
        })
    }  catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function searchUsers(req, res) {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({
                message: "Username is required"
            });
        }

        const users = await User.find({
            username: { $regex: username, $options: "i" }
        })
        .select("username fullname profilePicture");

        return res.status(200).json({
            message: "Users found successfully",
            users
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

module.exports={
    registerUser,loginUser,followUser,unfollowUser,getUserProfile,getFeed,searchUsers
}