require("dotenv").config();
const app=require('./app');
const connectDB=require("./config/db");

const PORT=process.env.PORT || 3000;

connectDB();

app.listen(PORT, function(){
    console.log(`server is runnning on port  ${PORT}`);
})