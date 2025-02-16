const express = require("express");
const Reservation = require("../models/Reservation");

const router = express.Router();

// 📌 1️⃣ Create a new reservation
router.post("/" ,async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation", error });
  }
});

// 📌 2️⃣ Get all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error });
  }
});

// 📌 3️⃣ Get a single reservation by ID
router.get("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservation", error });
  }
});

// 📌 4️⃣ Update a reservation by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReservation) return res.status(404).json({ message: "Reservation not found" });
    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Error updating reservation", error });
  }
});

// 📌 5️⃣ Delete a reservation by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) return res.status(404).json({ message: "Reservation not found" });
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservation", error });
  }
});

module.exports = router;
