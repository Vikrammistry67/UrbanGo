import configDotenv from "dotenv";

configDotenv.config();


const _config = {
    PORT: process.env.PORT,
    JWT_TOKEN: process.env.JWT_TOKEN,
    DB_URL: process.env.DB_URL
};


export default _config;