const multer=require("multer");
const path = require("path");
const upload=multer({
    dest: "uploads/",

    limits:{
        fileSize: 100 * 1024 * 1024
    },

    fileFilter: function(req, file, cb){

        console.log("FILE TYPE:", file.mimetype);
        console.log("FILE NAME:", file.originalname);
        const allowedTypes = [

            "video/mp4",
            "video/webm",
            "video/quicktime"
        ];

         const allowedExtensions = [
            ".mp4",
            ".webm",
            ".mov"
        ];

        const extension = path.extname(file.originalname).toLowerCase();


        if(allowedTypes.includes(file.mimetype) || allowedExtensions.includes(extension)) {
            cb(null,true);
        }else{
            cb(new Error("only MP4, WebM and MOV videos are allowed"));
        }
    }
});



module.exports=upload;