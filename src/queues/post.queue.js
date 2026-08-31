const { Queue }=require("bullmq");

const postQueue=new Queue("post-queue", {

    connection: {
        host: "localhost",
        port: 6379
    }
});

module.exports=postQueue;