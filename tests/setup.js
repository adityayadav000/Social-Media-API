require("dotenv").config();

const mongoose = require("mongoose");

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});