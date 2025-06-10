const express = require("express");
const { signup, login,getProfile ,updateProfile} = require("../controllers/userController");

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;