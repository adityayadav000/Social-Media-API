
require("dotenv").config();
const {Worker}= require("bullmq");
const Post = require("../models/post.model");
const connectDB = require("../config/db");

connectDB();
const worker=new Worker(
    "post-queue",

    async function (job){
        console.log("processing job:", job.name);
        console.log("job data:", job.data);

        const post = await Post.findById(job.data.postId);
        console.log("Post found:", post);
    },
    {

        connection: {
            host: "localhost",
            port: 6379
        }
    }
)

console.log("post worker started");