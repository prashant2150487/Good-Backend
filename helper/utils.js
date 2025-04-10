import nodemailer from "nodemailer";
import { emailPass, emailUser } from "../config/config.js";



const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
// Helper function to send OTP via email
const sendOTPEmail = async (email, otp) => {
  // Make sure credentials are available
  if (!emailUser || !emailPass) {
    throw new Error("Email credentials not configured");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Your OTP for Login",
    text: `Your OTP is ${otp}. It will expire in 15 minutes.`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    throw error;
  }
};
export { generateOTP, sendOTPEmail };
