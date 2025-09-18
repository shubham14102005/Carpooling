const express = require("express");
const { registerUser, loginUser, updateUserProfile, getUserStats } = require("../controllers/authController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.put("/users/:id", auth, updateUserProfile);
router.get("/users/:id/stats", auth, getUserStats);

module.exports = router;
