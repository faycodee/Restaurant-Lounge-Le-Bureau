const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  redeemCoupon,
} = require("../controllers/couponController");

const router = express.Router();

// Allow authenticated users to create coupons
router.post("/convert", verifyToken, createCoupon);

// Admin-only routes
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

// Public routes
router.get("/", getAllCoupons);
router.get("/:id", getCouponById);
router.post("/redeem", redeemCoupon);

module.exports = router;
