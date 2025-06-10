const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  isUsed: { type: Boolean, default: false },
  expiryDate: { type: Date, required: true },
  userId: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
