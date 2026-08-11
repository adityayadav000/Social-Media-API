const jwt =require("jsonwebtoken");
const User = require("../models/user.model");
async function verifyJWT(req,res,next){
    try{
    const authHeader=req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({
            message: "Unauthorized request"
        });
    }

    const token=authHeader.split(" ")[1];
    const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);

const user=await User.findById(decoded.userId);

if(!user){
    return res.status(401).json({
        message: "user not found"
    });
}
    req.user=user;

    next();
} catch (error){

    console.log(error);
    return res.status(401).json({
        message: "invalid or expired token"
    })
}
         
}

module.exports=verifyJWT;