const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL;
console.log("REDIS_URL configured:", Boolean(redisUrl));

const redisClient = createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: function(retries, cause) {
            if (/WRONGPASS|NOAUTH/i.test(cause.message)) {
                return false;
            }

            return Math.min(retries * 100, 3000);
        }
    }
});
let connectionPromise;

redisClient.on("error", function(err) {
    console.error("Redis client error", err);
});

async function connectRedis() {
    if (!redisUrl) {
        throw new Error("REDIS_URL is not configured");
    }

    if (redisClient.isReady) {
        return redisClient;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = redisClient.connect()
        .then(function() {
            console.log("Redis connected successfully");
            return redisClient;
        })
        .catch(function(error) {
            if (redisClient.isOpen && typeof redisClient.destroy === "function") {
                redisClient.destroy();
            }

            console.error("Redis connection failed:", error.message);
            throw error;
        })
        .finally(function() {
            connectionPromise = undefined;
        });

    return connectionPromise;
}
module.exports = {
    redisClient,
    connectRedis
};