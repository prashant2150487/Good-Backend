// # Environment variables and app configuration

module.exports = {
//   env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || "30d",
  mongoURI: process.env.MONGO_URI,
//   awsRegion: process.env.AWS_REGION,
//   awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
//   awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
//   s3Bucket: process.env.S3_BUCKET,
//   emailFrom: process.env.EMAIL_FROM,
//   smtpHost: process.env.SMTP_HOST,
//   smtpPort: process.env.SMTP_PORT,
//   smtpUser: process.env.SMTP_USER,
//   smtpPass: process.env.SMTP_PASS,
//   stripeSecretKey: process.env.STRIPE_SECRET_KEY,
//   stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
//   redisUrl: process.env.REDIS_URL,
//   clientUrl: process.env.CLIENT_URL,
};
