const DishSuggestion = require("../models/DishSuggestion");

exports.createDishSuggestion = async (req, res) => {
  try {
    const { prompt, suggestedDishes } = req.body;
    const newDishSuggestion = new DishSuggestion({ prompt, suggestedDishes });
    const savedDishSuggestion = await newDishSuggestion.save();
    res.status(201).json(savedDishSuggestion);
  } catch (error) {
    res.status(500).json({ message: "Error creating dish suggestion", error });
  }
};

exports.getAllDishSuggestions = async (req, res) => {
  try {
    const dishSuggestions = await DishSuggestion.find();
    res.json(dishSuggestions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dish suggestions", error });
  }
};

exports.getDishSuggestionById = async (req, res) => {
  try {
    const dishSuggestion = await DishSuggestion.findById(req.params.id);
    if (!dishSuggestion) return res.status(404).json({ message: "Dish suggestion not found" });
    res.json(dishSuggestion);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dish suggestion", error });
  }
};

exports.updateDishSuggestion = async (req, res) => {
  try {
    const updatedDishSuggestion = await DishSuggestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDishSuggestion) return res.status(404).json({ message: "Dish suggestion not found" });
    res.json(updatedDishSuggestion);
  } catch (error) {
    res.status(500).json({ message: "Error updating dish suggestion", error });
  }
};

exports.deleteDishSuggestion = async (req, res) => {
  try {
    const deletedDishSuggestion = await DishSuggestion.findByIdAndDelete(req.params.id);
    if (!deletedDishSuggestion) return res.status(404).json({ message: "Dish suggestion not found" });
    res.json({ message: "Dish suggestion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting dish suggestion", error });
  }
};