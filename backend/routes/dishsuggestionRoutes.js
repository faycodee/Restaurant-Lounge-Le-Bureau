const express = require("express");
const { verifyAdmin } = require("../middleware/authMiddleware");
const {
  createDishSuggestion,
  getAllDishSuggestions,
  getDishSuggestionById,
  updateDishSuggestion,
  deleteDishSuggestion,
} = require("../controllers/dishSuggestionController");

const router = express.Router();

// Admin-only routes
router.post("/", verifyAdmin, createDishSuggestion);
router.put("/:id", verifyAdmin, updateDishSuggestion);
router.delete("/:id", verifyAdmin, deleteDishSuggestion);

// Public routes
router.get("/", getAllDishSuggestions);
router.get("/:id", getDishSuggestionById);

module.exports = router;