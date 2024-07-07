const express = require("express");
const {
  registerUser,
  loginUser,
  fetchUserProfile,
  updateProfile,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", fetchUserProfile);
router.put("/profile", updateProfile);

module.exports = router;
