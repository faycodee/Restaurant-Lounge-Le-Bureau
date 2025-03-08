const express = require("express");
const Reservation = require("../models/Reservation");

const router = express.Router();

// 📌 2️⃣ Get all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error });
  }
});

// 📌 3️⃣ Get a single reservation by ID
router.get("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservation", error });
  }
});
const twilio = require("twilio");

// تهيئة عميل تويليو
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post("/", async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    const savedReservation = await newReservation.save();

    try {
      await client.messages.create({
        contentSid: "HXb5bef39ba2ded763c3a95da1dc226bb3",
        contentVariables: JSON.stringify({
          1: req.body.customer_name,
          2: req.body.reservation_date,
          3: req.body.reservation_time,
          4: req.body.guests.toString(),
          5: req.body.customer_phone,
          6: req.body.email || "N/A",
          7: savedReservation._id.toString(), // أهم جزء: إرسال ID الحجز
        }),
        from: "whatsapp:+14155238886", // رقم صندوق الرمل الخاص بتويليو
        to: "whatsapp:+212608494998", // استبدل برقم واتساب المدير
      });
      // body: `⬜️ New Reservation Created ✨:\n\n 📎 name : ${req.body.customer_name} \n 📎 date :${req.body.reservation_date}\n 📎 time :${req.body.reservation_time}\n 📎 guests : ${req.body.guests} \n\n ☎️ contact : \n${req.body.customer_phone}\n${req.body.email} `,
    } catch (whatsappError) {
      console.error("فشل إرسال إشعار واتساب:", whatsappError);
    }

    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الحجز", error });
  }
});
router.post(
  "https://restaurant-lounge-le-bureau.onrender.com/api/reservations/twilio-webhook",
  async (req, res) => {
    const payload = req.body.ButtonPayload; // بيانات الزر المضغوط

    if (!payload) return res.sendStatus(200);

    // فصل الحالة عن ID الحجز
    const [action, reservationId] = payload.split("_");

    try {
      // تحديث الحجز في قاعدة البيانات
      await Reservation.findByIdAndUpdate(reservationId, { status: action });

      // إرسال تأكيد للمدير (اختياري)
      await client.messages.create({
        body: `✅ تم تحديث الحجز ${reservationId} إلى "${action}"`,
        from: "whatsapp:+14155238886",
        to: req.body.From,
      });
    } catch (error) {
      console.error("خطأ في التحديث:", error);
    }

    res.sendStatus(200);
  }
);

// 📌 حذف حجز مع إشعار واتساب
router.delete("/:id", async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedReservation)
      return res.status(404).json({ message: "لم يتم العثور على الحجز" });

    try {
      await client.messages.create({
        body: `🟥 Reservation has been Deleted :\n\n 📎 name : ${deletedReservation.customer_name} \n 📎 date :${deletedReservation.reservation_date}\n 📎 time  :${deletedReservation.reservation_time}\n 📎 guests : ${deletedReservation.guests} \n 📎 status : ${deletedReservation.status}\n\n ☎️ contact :\n${deletedReservation.customer_phone}\n${deletedReservation.email} `,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+212608494998",
      });
    } catch (whatsappError) {
      console.error("فشل إرسال إشعار واتساب:", whatsappError);
    }

    res.json({ message: "تم حذف الحجز بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف الحجز", error });
  }
});

module.exports = router;
