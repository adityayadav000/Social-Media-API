const express=require('express');

const app=express();
app.use(function(req, res, next) {
    httpRequestsTotal.inc();

    const start = process.hrtime.bigint();

    res.on("finish", function() {
        const duration = Number(process.hrtime.bigint() - start) / 1e9;
        httpRequestDuration.observe(duration);

        if(res.statusCode >= 400){
            httpErrorsTotal.inc();
        }
    });

    next();
});

app.use(function(req,res,next){
    const start=Date.now();    //Start the stopwatch now

    res.on ("finish", function (){
        const duration=Date.now() - start;  // Calculate response time

        logger.info("HTTP request", {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode, // Gets the HTTP response status.
            duration: `${duration}ms`
        })
    })

    next(); //"I'm finished doing my middleware work. Continue processing this request."

})

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const testRouter=require("./routes/test.routes");
const userRouter=require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const reelRoutes=require("./routes/reels.routes");
const ReelcommentRoutes = require("./routes/Reelcomment.routes");
const logger = require("./config/logger");
const {register, httpRequestsTotal, httpRequestDuration, httpErrorsTotal} = require("./config/metrics");



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use("/api/reels", reelRoutes);
app.use("/api/reels", ReelcommentRoutes);

app.get('/', function(req,res){
    res.send("i am destined to greatness")
});
app.get("/health", function(req, res) {
    res.status(200).json({
        status: "ok"
    });
});
app.get("/metrics", async function (req,res){
    res.set("Content-type", register.contentType);
    res.end(await register.metrics()); //Give me all the metrics currently stored in the register.
    
})
app.use("/test", testRouter);
app.use("/users", userRouter);
app.use("/posts", postRoutes);
app.use("/posts", commentRoutes);

app.use(function(err, req, res, next) {
    logger.error("Request error", {
        method: req.method,
        url: req.originalUrl,
        statusCode: err.statusCode || 500,
        message: err.message
    });

    res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error"
    });
});

module.exports=app;   