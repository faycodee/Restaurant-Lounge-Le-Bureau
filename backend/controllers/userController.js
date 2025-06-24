const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

// Signup function

// Add these new functions to userController.js

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
      role: role || "customer", // Default role is "customer"
      loyaltyPoints: 500,
    });

    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        loyaltyPoints: savedUser.loyaltyPoints,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Signup error",
      error: error.message || error,
    });
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email address" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "2h",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints, // Add loyaltyPoints
        // Add any other fields you want to expose here
      },
    });
  } catch (error) {
    console.error("Login error:", error); // Log the error to the console
    res.status(500).json({
      success: false,
      message: "Login error",
      error: error.message || error,
    });
  }
};
