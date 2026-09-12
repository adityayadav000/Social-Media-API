const { Queue } = require("bullmq");
const redisClient = require("../config/redis");



const moderationQueue=new Queue("moderation", {
    connection: redisClient,

    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000
        }
    }
});



module.exports=moderationQueue;