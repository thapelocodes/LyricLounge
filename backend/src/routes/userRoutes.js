const express = require("express");
const {
  registerUser,
  loginUser,
  refreshToken,
  fetchUserProfile,
  updateProfile,
} = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.get("/profile", authMiddleware, fetchUserProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
