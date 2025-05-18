const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");
const Users = require("../models/Users");
const { sendWhatsAppNotification } = require("../utils/twilioService");

console.log("SECRET_KEY:", SECRET_KEY);
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservation", error });
  }
};

exports.createReservation = async (req, res) => {
  try {
    // Validate user_id if provided
    if (req.body.user_id) {
      if (!mongoose.Types.ObjectId.isValid(req.body.user_id)) {
        return res.status(400).json({
          message: "Invalid user_id format",
          error: "user_id must be a valid MongoDB ObjectId",
        });
      }
    }

    const newReservation = new Reservation(req.body);
    const savedReservation = await newReservation.save();

    // Update loyalty points for the user
    if (req.body.user_id) {
      const user = await Users.findById(req.body.user_id);
      if (user) {
        user.loyaltyPoints += 10;
        await user.save();
      }
    }

    // Send WhatsApp notification
    try {
      await sendWhatsAppNotification("create", savedReservation);
      console.log("WhatsApp notification sent for new reservation");
    } catch (notificationError) {
      console.error("WhatsApp notification failed:", notificationError);
    }

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: savedReservation,
    });
  } catch (error) {
    console.error("Reservation creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating reservation",
      error: error.message,
    });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check if user_id from request body matches the reservation's user_id
    if (req.body.user_id && reservation.user_id) {
      if (reservation.user_id.toString() !== req.body.user_id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this reservation",
        });
      }
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Send WhatsApp notification
    try {
      await sendWhatsAppNotification("update", updatedReservation);
      console.log("WhatsApp notification sent for updated reservation");
    } catch (notificationError) {
      console.error("WhatsApp notification failed:", notificationError);
    }

    res.json({
      success: true,
      message: "Reservation updated successfully",
      data: updatedReservation,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating reservation",
      error: error.message,
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check if user_id from request body matches the reservation's user_id
    if (req.body.user_id && reservation.user_id) {
      if (reservation.user_id.toString() !== req.body.user_id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this reservation",
        });
      }
    }

    // Send WhatsApp notification before deletion
    try {
      await sendWhatsAppNotification("delete", reservation);
      console.log("WhatsApp notification sent for deleted reservation");
    } catch (notificationError) {
      console.error("WhatsApp notification failed:", notificationError);
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting reservation",
      error: error.message,
    });
  }
};
