const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users"); // استخدام نموذج الـ Users
const { verifyAdmin } = require("../middleware/authMiddleware");
const Reservation = require("../models/Reservation");
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY; // استبدالها بمفتاح سري قوي

// 📌 تسجيل الدخول للأدمن
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // البحث عن المستخدم في قاعدة البيانات
    const user = await Users.findOne({ email }); // هنا بحثنا في مجموعة users
    if (!user)
      return res.status(401).json({ message: "البريد الإلكتروني غير صحيح" });

    // التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "كلمة المرور غير صحيحة" });

    // التحقق من إذا كان المستخدم هو أدمن
    if (user.role !== "admin") {
      return res.status(403).json({ message: "أنت لست أدمن" });
    }

    // إنشاء توكن JWT
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "2h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ في تسجيل الدخول", error });
  }
});
router.get("/reservations", verifyAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الحجوزات" });
  }
});
// 📌 3️⃣ Get a single reservation by ID
router.get("/reservations/:id",verifyAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservation", error });
  }
});
// 📌 إضافة حجز جديد (فقط للأدمن)
router.post("/reservations", verifyAdmin, async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      reservation_date,
      reservation_time,
      guests,
      table,
    } = req.body;

    const newReservation = new Reservation({
      customer_name,
      customer_phone,
      reservation_date,
      reservation_time,
      guests,
      table,
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: "خطأ في إضافة الحجز" });
  }
});

router.put("/reservations/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: "خطأ في تعديل الحجز" });
  }
});


router.delete("/reservations/:id", verifyAdmin, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف الحجز بنجاح" });
  } catch (error) {
    res.status(400).json({ message: "خطأ في حذف الحجز" });
  }
});

module.exports = router;
