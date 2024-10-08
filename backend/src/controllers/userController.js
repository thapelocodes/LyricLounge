const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Generate tokens
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
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
      req.user = user;
      const refreshToken = generateRefreshToken(user._id);
      const accessToken = generateAccessToken(user._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      console.log("res.cookie", res.cookie);

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: accessToken,
        bio: user.bio,
        profilePicture: user.profilePicture,
      });
    } else {
      res.status(401).json({ message: "Invalid login or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token found" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.id);

    res.json({ token: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Fetch user profile
const fetchUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userFromDB = await User.findById(userId);
    if (!userFromDB) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = {
      _id: userFromDB._id,
      username: userFromDB.username,
      email: userFromDB.email,
      chatrooms: userFromDB.chatrooms,
      __v: userFromDB.__v,
      bio: userFromDB.bio,
      profilePicture: userFromDB.profilePicture,
    };
    console.log("user", user);
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
