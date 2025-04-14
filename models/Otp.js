import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});
// Hash OTP before saving
otpSchema.pre("save", async function (next){
  if(!this.isModified("otp")){
    return next();
  }
  // Hash the OTP using bcrypt
  const salt=await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
  next();
})
// Method to compare entered OTP with hashed OTP
otpSchema.methods.matchOTP = async function (enteredOtp) {
  console.log("Comparing OTPs: ", enteredOtp, this.otp);
  return await bcrypt.compare(enteredOtp, this.otp);
};

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
