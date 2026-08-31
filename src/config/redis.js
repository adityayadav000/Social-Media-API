const { createClient }=require("redis");

const redisClient=createClient({
    url: "redis://localhost:6379"
});

redisClient.on("error", function(err){
    console.error("Redis client error", err);
})

async function connectRedis(){
    try{
    await redisClient.connect();
    console.log("redis connected succesfully");
}catch (error){
    console.error("redis connection failed :", error.message);
    throw error;
}
}
module.exports={
    redisClient,
    connectRedis
};