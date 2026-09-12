require("dotenv").config();
const logger = require("./config/logger");
const app=require('./app');
const connectDB=require("./config/db");
const { connectRedis, redisClient } = require("./config/redis");
const PORT=process.env.PORT || 3000;
async function startServer(){

    try{
        await connectDB();
        await connectRedis();

        

       app.listen(PORT, "0.0.0.0", function() {
    logger.info(`Server is running on port ${PORT}`);
});
    }catch(error){
        console.error("failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
