const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
  email: { type: String }, 
  reservation_date: { type: String, required: true },
  reservation_time: { type: String, required: true },
  guests: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled", "completed"], 
    default: "pending" 
  }
});

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
