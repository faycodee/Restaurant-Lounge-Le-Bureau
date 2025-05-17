const express = require("express");
const { verifyAdmin } = require("../middleware/authMiddleware");
const {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationController");

const router = express.Router();

// Admin-only routes
router.get("/", getAllReservations);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

// Public route
router.post("/", createReservation);

module.exports = router;