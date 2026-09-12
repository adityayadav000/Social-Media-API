require("dotenv").config();

const { moderateContent } = require("./services/ai/moderation2.service");

async function main() {

    const result = await moderateContent(
        "oh fuck you bitch."
    );

    console.log(result);
}

main();