// # Environment variables and app configuration

import dotenv from "dotenv";
dotenv.config();
export const jwtSecret = process.env.JWT_SECRET || "fallbackSecretKey";
export const jwtExpire = process.env.JWT_EXPIRE || "30d";
export const mongoURI = process.env.MONGO_URI;
export const port = process.env.PORT || 5000;