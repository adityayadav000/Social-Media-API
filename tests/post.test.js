const request = require("supertest");
const app = require("../src/app");

describe("DELETE /posts/:postId", () => {

    it("should prevent a user from deleting another user's post", async () => {

        // Create User A
        await request(app)
            .post("/users/register")
            .send({
                fullName: "Post Owner",
                username: "postowner123",
                email: "postowner123@gmail.com",
                password: "TestPassword123"
            });

        // Login User A
        const ownerLogin = await request(app)
            .post("/users/login")
            .send({
                email: "postowner123@gmail.com",
                password: "TestPassword123"
            });

        const ownerToken = ownerLogin.body.token;

        // Create User B
        await request(app)
            .post("/users/register")
            .send({
                fullName: "Other User",
                username: "otheruser123",
                email: "otheruser123@gmail.com",
                password: "TestPassword123"
            });

        // Login User B
        const otherLogin = await request(app)
            .post("/users/login")
            .send({
                email: "otheruser123@gmail.com",
                password: "TestPassword123"
            });

        const otherToken = otherLogin.body.token;

        // User A creates the post
        const postResponse = await request(app)
            .post("/posts/create")
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                content: "This post belongs to User A"
            });

        const postId = postResponse.body.post._id;

        // User B tries to delete User A's post
        const response = await request(app)
            .delete(`/posts/${postId}`)
            .set("Authorization", `Bearer ${otherToken}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.message)
            .toBe("you are not allowed to delete this post");
    });

});

it("should allow the owner to delete their own post", async () => {

    // Create user
    await request(app)
        .post("/users/register")
        .send({
            fullName: "Delete Owner",
            username: "deleteowner123",
            email: "deleteowner123@gmail.com",
            password: "TestPassword123"
        });

    // Login
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: "deleteowner123@gmail.com",
            password: "TestPassword123"
        });

    const token = loginResponse.body.token;

    // Create post
    const postResponse = await request(app)
        .post("/posts/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            content: "This post will be deleted"
        });

    const postId = postResponse.body.post._id;

    // Owner deletes their own post
    const response = await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Post deleted successfully");
});

it("should return 404 when the post does not exist", async () => {

    // Create a user
    await request(app)
        .post("/users/register")
        .send({
            fullName: "Not Found User",
            username: "notfounduser123",
            email: "notfounduser123@gmail.com",
            password: "TestPassword123"
        });

    // Login
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: "notfounduser123@gmail.com",
            password: "TestPassword123"
        });

    const token = loginResponse.body.token;

    // A valid MongoDB ObjectId format,
    // but no post with this ID exists.
    const fakePostId = "507f1f77bcf86cd799439011";

    const response = await request(app)
        .delete(`/posts/${fakePostId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Post not found");
});