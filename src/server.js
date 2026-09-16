require("dotenv").config();
const logger = require("./config/logger");
const app=require('./app');
const connectDB=require("./config/db");
const { connectRedis, redisClient } = require("./config/redis");
const PORT=process.env.PORT || 3000;
async function startServer(){

    try{
        logger.info("Connecting to DB...");
        await connectDB();
        logger.info("DB connected. Connecting to Redis...");
        await connectRedis();
        logger.info("Redis connected. Starting server...");

        

       app.listen(PORT, "0.0.0.0", function() {
    logger.info(`Server is running on port ${PORT}`);
});
    }catch(error){
        console.error("failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
