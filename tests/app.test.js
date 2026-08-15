const request=require("supertest");
const app =require("../src/app");


describe("GET /",  function(){
    it("should return the welcome message", async function(){
        const response=await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("i am destined to greatness")
    })
} )