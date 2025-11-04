import dotenv from "dotenv";

dotenv.config();

const _config = {
    port: process.env.PORT!,
    jwt_secret: process.env.JWT_SECRET!
}

export const config = Object.freeze(_config)