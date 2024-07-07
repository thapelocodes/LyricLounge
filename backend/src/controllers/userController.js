const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await User.create({ username, email, password });
    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    resizeTo.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { login, password } = req.body;
  try {
    const isEmail = login.includes("@");
    const user = isEmail
      ? await User.findOne({ email: login })
      : await User.findOne({ username: login });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    resizeTo.status(500).json({ message: error.message });
  }
};

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

const updateProfile = async (req, res) => {
  const { username, email, profilePicture, bio } = req.body;
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

module.exports = { registerUser, loginUser, fetchUserProfile, updateProfile };
