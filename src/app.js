const express=require('express');

const app=express();

const testRouter=require("./routes/test.routes");
const userRouter=require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
app.use(express.json());

app.get('/', function(req,res){
    res.send("i am destined to greatness")
});

app.use("/test", testRouter);
app.use("/users", userRouter);
app.use("/posts", postRoutes);
app.use("/posts", commentRoutes);
module.exports=app;   