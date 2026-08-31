const multer=require("multer");

const upload=multer({
    dest: "uploads/",

    limits:{
        fileSize: 100 * 1024 * 1024
    },

    fileFilter: function(req, file, cb){
        const allowedTypes = [

            "video/mp4",
            "video/webm",
            "video/quicktime"
        ];

        if(allowedTypes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error("only MP4, WebM and MOV videos are allowed"));
        }
    }
});



module.exports=upload;