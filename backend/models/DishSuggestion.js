const mongoose = require("mongoose");

const dishSuggestionSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  suggestedDishes: { type: String, required: true },
});

const DishSuggestion = mongoose.model("DishSuggestion", dishSuggestionSchema);
module.exports = DishSuggestion;