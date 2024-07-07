const express = require("express");
const {
  registerUser,
  loginUser,
  fetchUserProfile,
  updateProfile,
} = require("../controllers/userController");
const { authMiddleware } = require("../middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, fetchUserProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
