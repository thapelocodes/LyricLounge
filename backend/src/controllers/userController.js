const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const path = require("path");

// Generate tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
};

// Register user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });
    if (emailExists) {
      return res
        .status(400)
        .json({ message: `An account for ${email} already exists` });
    }

    if (usernameExists) {
      return res.status(400).json({ message: `${username} is already in use` });
    }

    const user = await User.create({ username, email, password });
    if (user) {
      res.status(201).json({ message: "User registered successfully!" });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { login, password } = req.body;
  try {
    const isEmail = login.includes("@");
    const user = isEmail
      ? await User.findOne({ email: login })
      : await User.findOne({ username: login });
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      await RefreshToken.deleteMany({ userId: user._id });
      await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: accessToken,
        refreshToken,
        bio: user.bio,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.body;
  if (!oldRefreshToken) {
    return res.status(403).json({ message: "Access is forbidden" });
  }

  try {
    const tokenDoc = await RefreshToken.findOne({
      token: oldRefreshToken,
      expiresAt: { $gte: new Date() },
    });
    if (!tokenDoc)
      return res.status(401).json({ message: "Invalid refresh token" });

    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    await RefreshToken.deleteOne({ token: oldRefreshToken });
    await RefreshToken.create({
      userId: user._id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Fetch user profile
const fetchUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  const { username, email, bio } = req.body;
  console.log("req.file value:", req.file);
  const profilePicture = req.file ? req.file.path : null;

  try {
    const userId = req.user.id;
    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (profilePicture) updatedFields.profilePicture = profilePicture;
    if (bio) updatedFields.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  fetchUserProfile,
  updateProfile,
};
