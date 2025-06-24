const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const couponController = require("../controllers/couponController");

const router = express.Router();

// Allow authenticated users to create coupons
router.post("/convert", couponController.createCoupon);

// Admin-only routes
router.post("/", couponController.createCoupon);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);

// Public routes
router.get("/", couponController.getAllCoupons);
router.get("/:id", couponController.getCouponById);
router.post("/redeem", couponController.redeemCoupon);

module.exports = router;
