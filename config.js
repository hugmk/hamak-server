var config = {};

config.jwt = {
    secret: "3f4df2c76451a7944e70a6cbc662e0b704f5798d66d379b3744f2b8ffc368e8c" || process.env.JWT_SECRET
}

config.https = {
    key: "./ssl/server.key" || process.env.HTTPS_KEY_PATH,
    cert: "./ssl/server.cert" || process.env.HTTPS_CERT_PATH
};

config.cors = {
    whiteList: {
        local: ["http://localhost:4200"],
        prod: [],
    }
};

//database uris for prod and dev environnements
config.mongoURI = {
    local: "mongodb://127.0.0.1:27017/ppd_test",
    prod: "",
};

//rate limiting
config.rateLimit = {
    local: {
        windowMs: 60 * 1000, // 1 minute
        max: 100, // limit each IP to 100 requests per windowMs
    },
    prod: {
        windowMs: 60 * 1000, // 1 minute
        max: 100, // limit each IP to 100 requests per windowMs
    },
};

module.exports = config;