const swaggerJsdoc = require("swagger-jsdoc");

const options= {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Social Media API",
            version: "1.0.0",
            description:"backend API for a social media application"
        },
        components:{
            securitySchemes: {
                bearerAuth:{
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./src/routes/*.js"]
};

const swaggerSpec=swaggerJsdoc(options);

module.exports=swaggerSpec;