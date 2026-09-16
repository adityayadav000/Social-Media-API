const { Queue } = require("bullmq");

const connection = {
    url: process.env.REDIS_URL
};

const moderationQueue=new Queue("moderation", {
    connection,

    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000
        }
    }
});



module.exports=moderationQueue;