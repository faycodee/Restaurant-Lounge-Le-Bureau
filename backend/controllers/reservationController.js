const Reservation = require("../models/Reservation");
const Users = require("../models/Users");

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
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Error updating reservation", error });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedReservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservation", error });
  }
};
