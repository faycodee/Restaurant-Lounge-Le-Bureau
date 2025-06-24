const Coupon = require("../models/Coupon");
const Users = require("../models/Users");

exports.createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate, userId, pointsRequired } =
      req.body;

    // Verify user exists and has enough points
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.loyaltyPoints < pointsRequired) {
      return res.status(400).json({ message: "Not enough points" });
    }

    // Create the coupon
    const newCoupon = new Coupon({
      code,
      discountPercentage,
      expiryDate,
      userId,
    });

    // Save coupon and update user points
    const savedCoupon = await newCoupon.save();
    user.loyaltyPoints -= pointsRequired;
    await user.save();

    res.status(201).json(savedCoupon);
  } catch (error) {
    console.error("Coupon creation error:", error);
    res.status(500).json({
      message: "Error creating coupon ",
      error: error.message,
    });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    const coupons = await Coupon.find(query);
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error });
  }
};

exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupon", error });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCoupon)
      return res.status(404).json({ message: "Coupon not found" });
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: "Error updating coupon", error });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon)
      return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon", error });
  }
};

exports.redeemCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    if (coupon.isUsed)
      return res.status(400).json({ message: "Coupon already used" });
    if (new Date() > new Date(coupon.expiryDate))
      return res.status(400).json({ message: "Coupon expired" });
    coupon.isUsed = true;
    await coupon.save();
    res.json({
      message: "Coupon redeemed successfully",
      discount: coupon.discountPercentage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error redeeming coupon", error });
  }
};
