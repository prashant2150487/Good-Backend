// # Environment variables and app configuration


export const port = process.env.PORT || 5000;
export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpire = process.env.JWT_EXPIRE || "30d";
export const mongoURI = process.env.MONGO_URI;
