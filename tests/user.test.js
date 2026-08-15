const jwt = require("jsonwebtoken");
const request=require("supertest");
const app =require("../src/app");

describe("POST /users/register", function(){

    it("should return 409 if username or email already exists", async () => {
    const user = {
        fullName: "Duplicate User",
        username: "duplicateuser123",
        email: "duplicate123@gmail.com",
        password: "TestPassword123"
    };

    // First registration
    await request(app)
        .post("/users/register")
        .send(user);

    // Second registration with same username/email
    const response = await request(app)
        .post("/users/register")
        .send(user);

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe("username or email already exists");
});

    it("should return 400 when required fields are missing", async () => {
    const response = await request(app)
        .post("/users/register")
        .send({
            username: "testuser"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("All fields are required");
});

    it ("should register a new user",async function(){
        const response=await request(app)
        .post("/users/register")
        .send({
             fullName: "Test User",
                username: "testuser12345",
                email: "testuser12345@gmail.com",
                password: "TestPassword123"
        })

         expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("user registered successfully");
        expect(response.body.user).toBeDefined();
    })
})

describe("POST /users/login", () => {

    it("should return 401 for an incorrect password", async () => {

    // Create a user first
    await request(app)
        .post("/users/register")
        .send({
            fullName: "Wrong Password User",
            username: "wrongpassword123",
            email: "wrongpassword123@gmail.com",
            password: "CorrectPassword123"
        });

    // Try to login with the wrong password
    const response = await request(app)
        .post("/users/login")
        .send({
            email: "wrongpassword123@gmail.com",
            password: "WrongPassword123"
        });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
});

    it("should login an existing user and return a JWT", async () => {

        // Create a user first
        await request(app)
            .post("/users/register")
            .send({
                fullName: "Login Test User",
                username: "logintest123",
                email: "logintest123@gmail.com",
                password: "TestPassword123"
            });

        // Login using the same credentials
        const response = await request(app)
            .post("/users/login")
            .send({
                email: "logintest123@gmail.com",
                password: "TestPassword123"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Login Successful");
        expect(response.body.token).toBeDefined();
    });

});

it("should return 401 if the email does not exist", async () => {

    const response = await request(app)
        .post("/users/login")
        .send({
            email: "doesnotexist123@gmail.com",
            password: "SomePassword123"
        });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
});

it("should return 400 when email or password is missing", async () => {

    const response = await request(app)
        .post("/users/login")
        .send({
            email: "test@example.com"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Email and password are required");
});


describe("GET /users/profile", () => {

    it("should return 401 when no token is provided", async () => {

        const response = await request(app)
            .get("/users/profile");

        expect(response.statusCode).toBe(401);
    });

});

it("should return the profile when a valid JWT is provided", async () => {

    // Create a user
    await request(app)
        .post("/users/register")
        .send({
            fullName: "Profile Test User",
            username: "profiletest123",
            email: "profiletest123@gmail.com",
            password: "TestPassword123"
        });

    // Login to get JWT
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: "profiletest123@gmail.com",
            password: "TestPassword123"
        });

    const token = loginResponse.body.token;

    // Access protected profile route
    const response = await request(app)
        .get("/users/profile")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("profile fetched successfully");
});

it("should return 401 when an invalid JWT is provided", async () => {

    const response = await request(app)
        .get("/users/profile")
        .set("Authorization", "Bearer invalidtoken123");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("invalid or expired token");
});

it("should return 401 when JWT user does not exist", async () => {

    const fakeToken = jwt.sign(
        {
            userId: "507f1f77bcf86cd799439011"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    const response = await request(app)
        .get("/users/profile")
        .set("Authorization", `Bearer ${fakeToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("user not found");
});