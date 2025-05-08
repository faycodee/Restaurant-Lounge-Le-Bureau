const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users"); // Import Users model
const Reservation = require("../models/Reservation"); // Import Reservation model
const { verifyAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY; // Replace with a strong secret key

// 📌 Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await Users.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email address" });

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "2h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints, // Include loyalty points
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
});

// 📌 Get All Reservations (Admin Only)
router.get("/reservations", verifyAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error });
  }
});

// 📌 Get a Single Reservation by ID (Admin Only)
router.get("/reservations/:id", verifyAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservation", error });
  }
});

// 📌 Add a New Reservation (Admin Only)
router.post("/reservations", verifyAdmin, async (req, res) => {
  try {
    const {
      user_id,
      customer_name,
      customer_phone,
      email,
      reservation_date,
      reservation_time,
      guests,
    } = req.body;

    const newReservation = new Reservation({
      user_id,
      customer_name,
      customer_phone,
      email,
      reservation_date,
      reservation_time,
      guests,
    });

    const savedReservation = await newReservation.save();

    // Update loyalty points for the user
    if (user_id) {
      const user = await Users.findById(user_id);
      if (user) {
        user.loyaltyPoints += 10; // Add 10 loyalty points for each reservation
        await user.save();
      }
    }

    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: "Error adding reservation", error });
  }
});

// 📌 Update a Reservation (Admin Only)
router.put("/reservations/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: "Error updating reservation", error });
  }
});

// 📌 Delete a Reservation (Admin Only)
router.delete("/reservations/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedReservation)
      return res.status(404).json({ message: "Reservation not found" });

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting reservation", error });
  }
});

module.exports = router;
