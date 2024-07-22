const express = require("express");
const {
  registerUser,
  loginUser,
  fetchUserProfile,
  updateProfile,
  refreshToken,
} = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, fetchUserProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/refresh", refreshToken);

module.exports = router;
