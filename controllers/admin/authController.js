// @desc    Register admin
// @route   POST /api/admin/auth/register

import User from "../../models/User.js";
const checkUser = async (req,res) => {
  try {
    const { email} = require.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      // Email exists, generate and send OTP
      const otp = generateOTP(); //6 digit OTP
      // Store OTP in database with expiry (15 minutes)
      await Option.findOneAndUpdate(
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
      await sendOTPEmail(email, otp);
    } else {
      // Email doesn't exist, client should redirect to registration
      return res.status(200).json({
        success: true,
        emailExist: false,
        message: "Email not registered. Please sign up.",
      });
    }
  } catch (error) {
    res.status(500).status({
      success: true,
      message: "Server error",
      error: error.message,
    });
  }
};

// Add a new route to verify OTP
const verifyOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and OTP"
        });
      }
      
      const otpRecord = await OTP.findOne({ 
        email,
        expiresAt: { $gt: new Date() }
      });
      
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "OTP expired or not found"
        });
      }
      
      if (otpRecord.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP"
        });
      }
      
      // OTP is valid, delete it to prevent reuse
      await OTP.findOneAndDelete({ email });
      
      // Generate authentication token for the user
      const user = await User.findOne({ email });
      const token = generateAuthToken(user); // Implement this function
      
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        token
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };
// Helper function to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
// Helper function to send OTP via email
const sendOTPEmail = async (email, otp) => {
    // Implement your email sending logic here
    // Example with nodemailer:
    
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    //   }
    // });
    
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: 'Your OTP for Login',
    //   text: `Your OTP is ${otp}. It will expire in 15 minutes.`
    // };
    
    // await transporter.sendMail(mailOptions);
  };

export { checkUser };
