import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🧍 Register admin (only once)
// export const registerUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const userExists = await User.findOne({ username });
//     if (userExists) return res.status(400).json({ message: "User already exists" });

//     const user = await User.create({ username, email, password });

//     res.status(201).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// ✉️ Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.username},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" target="_blank" style="color:#2563eb;font-weight:bold;">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail({
      to: user.username, // assuming username is email
      subject: "Password Reset - Nafii Portfolio",
      html: message,
    });

    res.json({ message: "Password reset email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email could not be sent" });
  }
};

// 🔓 Login admin
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
