const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
exports.registerUser = async (req, res) => {

  const { fullName, email, password, profileImageUrl } = req.body;

  // Check for missing fields
  if (!fullName || !email || !password ) {
   
    return res.status(401).json({ message: "Please fill all the fields" });
  }

  try {
    // Check if user already exists
    const existUser = await User.findOne({ email });

    if (existUser) {
      console.warn("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const trimmedPassword = password.trim();
  
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

 
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

  

    res.status(201).json({
      success: true,
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
   
    res.status(500).json({
      success: false,
      message: "Error occurred",
      error: error.message,
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid request, body is missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email " });
    }
    const isPasswordMatch = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      success: true,
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred",
      error: error.message,
    });
  }
};

// Get User Info (Protected Route)
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred",
      error: error.message,
    });
  }
};
