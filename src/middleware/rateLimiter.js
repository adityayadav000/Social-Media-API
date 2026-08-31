const {redisClient}=require("../config/redis");

async function loginRateLimiter(req, res, next){

    try{
        const ip=req.ip;
        
        const key=`rate-limit:login:${ip}`;

        const attempts=await redisClient.incr(key);

        if(attempts === 1){
            await redisClient.expire(key,60);
        }

        if(attempts > 5){
            return res.status(429).json({
                message: "too many login attempts.Try again later."
            });
        }

        next();
    }catch (error) {
        console.log("rate limiter error:", error);

        next();
    }
}

module.exports=loginRateLimiter;