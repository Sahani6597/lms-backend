import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password ,role} = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword ,role});

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Validate role
    const validRoles = ['admin', 'instructor', 'student'];
    if (!validRoles.includes(user.role)) {
      return res.status(400).json({ message: "Invalid user role" });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role // Include role in token
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // Include role in response
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const blacklistedTokens = new Set(); // Store invalidated tokens (in-memory)

export const logoutUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(400).json({ message: "No token provided" });

  blacklistedTokens.add(token);
  res.json({ message: "Logout successful" });
};

export const isTokenBlacklisted = (token) => blacklistedTokens.has(token);

export const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select('-password');
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};