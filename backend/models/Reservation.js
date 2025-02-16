const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  customer_name: { type: String, required: true }, // اسم العميل
  customer_phone: { type: String, required: true }, // رقم الهاتف
  reservation_date: { type: String, required: true }, // تاريخ الحجز
  reservation_time: { type: String, required: true }, // وقت الحجز
  guests: { type: Number, required: true }, // عدد الضيوف
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    default: "pending" 
  }, // حالة الحجز
  table: {
    table_number: { type: Number, required: true }, // رقم الطاولة
    capacity: { type: Number, required: true } // سعة الطاولة
  }
});

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
