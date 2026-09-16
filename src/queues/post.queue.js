const { Queue } = require("bullmq");

const connection = {
    url: process.env.REDIS_URL
};

const postQueue=new Queue("post-queue", {

    connection
});

module.exports=postQueue;