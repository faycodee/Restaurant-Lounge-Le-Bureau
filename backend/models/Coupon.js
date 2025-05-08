const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  isUsed: { type: Boolean, default: false },
  expiryDate: { type: Date, required: true },
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;