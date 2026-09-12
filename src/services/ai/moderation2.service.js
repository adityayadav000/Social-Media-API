const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function moderateContent(content) {

    try{
     const response=await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents:  `
Analyze this social media caption for moderation.

Caption:
"${content}"` ,
//for structured json
config: {

    responseMimeType:"application/json",

    responseSchema: {
        type: "object",
        properties: {
            decision: {
                type: "string",
                 enum: ["approved", "hidden", "review"]
            },
            category:{
                type: "string"
            },
            confidence: {
                type: "number"
            },
            reason: {
                type: "string"
            }
        },
        required: [

            "decision",
            "category",
            "confidence",
            "reason"
        ]
    }
}
    });

   const result = JSON.parse(response.text);
 
//just to keep api in check 

if (
    !["approved", "hidden", "review"].includes(result.decision) ||
    typeof result.confidence !== "number" ||
    typeof result.category !== "string" ||
    typeof result.reason !== "string"
) {
    throw new Error("Invalid moderation response from Gemini");
}

return result;
}
 catch(error){
        console.error("gemini moderation failed:", error.message);

        if(error.status === 400 || error.status === 401 || error.status===403){
            error.retryable=false;
        }else{
            error.retryable=true;
        }

        throw error;
}
}


module.exports = {
    moderateContent
};