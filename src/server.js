require("dotenv").config();
const app=require('./app');
const connectDB=require("./config/db");
const { connectRedis, redisClient } = require("./config/redis");
const PORT=process.env.PORT || 3000;
async function startServer(){

    try{
        await connectDB();
        await connectRedis();

        

        app.listen(PORT, function(){
    console.log(`server is runnning on port  ${PORT}`);
});
    }catch(error){
        console.error("failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
