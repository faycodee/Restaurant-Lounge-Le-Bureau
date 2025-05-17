const express = require("express");
const { verifyAdmin } = require("../middleware/authMiddleware");
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  redeemCoupon,
} = require("../controllers/couponController");

const router = express.Router();

// Admin-only routes
router.post("/", verifyAdmin, createCoupon);
router.put("/:id", verifyAdmin, updateCoupon);
router.delete("/:id", verifyAdmin, deleteCoupon);

// Public routes
router.get("/", getAllCoupons);
router.get("/:id", getCouponById);
router.post("/redeem", redeemCoupon);

module.exports = router;