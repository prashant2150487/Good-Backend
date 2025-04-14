
import OTP from "../../models/Otp.js";
import User from "../../models/User.js";
import { generateOTP, sendOTPEmail } from "../../helper/utils.js";
const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email",
      });
    }
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        invalidDomain: true,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      // Email exists, generate and send OTP
      const otp = generateOTP(); //6 digit OTP
      // Store OTP in database with expiry (15 minutes)
      await OTP.findOneAndUpdate(
        {
          email,
        },
        {
          otp,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
        { upsert: true, new: true }
      );
      // Send OTP to user's email
      try {
        await sendOTPEmail(email, otp);
        return res.status(200).json({
          success: true,
          emailExist: true,
          message: "OTP sent to your email",
          invalidDomain: false,
        });
      } catch (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP email",
          error: error.message,
          invalidDomain: false,
        });
      }
    } else {
      // Email doesn't exist, client should redirect to registration
      return res.status(200).json({
        success: true,
        emailExist: false,
        message: "Email not registered. Please sign up.",
        invalidDomain: false,
      });
    }
  } catch (error) {
    console.error("Server error in checkUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      password,
      country,
      dateOfBirth,
      gender,
      phoneCountryCode,
      phoneNo,
      whatsappSubscribe,
      city,
      role = "admin",
    } = req.body;
    // Validate Input
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields (email, firstName, lastName, password)",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      city,
      country,
      phoneCountryCode,
      phoneNo,
      gender,
      dateOfBirth,
      whatsappSubscribe,
    });

    if (user) {
      const token = user.getSignedJwtToken();
      res.status(201).json({
        success: true,
        token,
        message: "User registered successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.error("Server error in registerUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};
// Add a new route to verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("Received OTP verification request:", req.body);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and OTP",
      });
    }

    const otpRecord = await OTP.findOne({
      email,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is valid, delete it to prevent reuse
    await OTP.findOneAndDelete({ email });

    // Generate authentication token for the user
    const user = await User.findOne({ email });
    const token = user.getSignedJwtToken();

    // Implement this function

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { checkUser, registerUser , verifyOTP };
