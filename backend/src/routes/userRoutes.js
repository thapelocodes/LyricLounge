const express = require("express");
const upload = require("../middleware/uploadMiddleware");
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
router
  .route("/profile")
  .get(authMiddleware, fetchUserProfile)
  .put(authMiddleware, upload.single("profilePicture"), updateProfile);

module.exports = router;
