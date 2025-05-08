const express = require("express");
const Reservation = require("../models/Reservation");
const Users = require("../models/Users"); // Import Users model
const twilio = require("twilio");

const router = express.Router();

// Initialize Twilio client
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 📌 Get all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error });
  }
});

// 📌 Get a single reservation by ID
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

// 📌 Create a new reservation
router.post("/", async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    const savedReservation = await newReservation.save();

    // Update loyalty points for the user
    if (req.body.user_id) {
      const user = await Users.findById(req.body.user_id);
      if (user) {
        user.loyaltyPoints += 10; // Add 10 loyalty points for each reservation
        await user.save();
      }
    }

    // Send WhatsApp notification
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
          7: savedReservation._id.toString(), // Send reservation ID
        }),
        from: "whatsapp:+14155238886", // Twilio sandbox number
        to: "whatsapp:+212608494998", // Replace with manager's WhatsApp number
      });
    } catch (whatsappError) {
      console.error("Failed to send WhatsApp notification:", whatsappError);
    }

    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation", error });
  }
});

// 📌 Update reservation status via Twilio webhook
router.post("/twilio-webhook", async (req, res) => {
  const payload = req.body.ButtonPayload; // Extract button payload

  if (!payload) return res.sendStatus(200);

  // Split action and reservation ID
  const [action, reservationId] = payload.split("_");

  try {
    // Update reservation status in the database
    await Reservation.findByIdAndUpdate(reservationId, { status: action });

    // Send confirmation to the manager (optional)
    await client.messages.create({
      body: `✅ Reservation ${reservationId} updated to "${action}"`,
      from: "whatsapp:+14155238886",
      to: req.body.From,
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
  }

  res.sendStatus(200);
});

// 📌 Delete a reservation with WhatsApp notification
router.delete("/:id", async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedReservation)
      return res.status(404).json({ message: "Reservation not found" });

    // Send WhatsApp notification
    try {
      await client.messages.create({
        body: `🟥 Reservation Deleted:\n\n 📎 Name: ${deletedReservation.customer_name} \n 📎 Date: ${deletedReservation.reservation_date}\n 📎 Time: ${deletedReservation.reservation_time}\n 📎 Guests: ${deletedReservation.guests} \n 📎 Status: ${deletedReservation.status}\n\n ☎️ Contact:\n${deletedReservation.customer_phone}\n${deletedReservation.email}`,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+212608494998",
      });
    } catch (whatsappError) {
      console.error("Failed to send WhatsApp notification:", whatsappError);
    }

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservation", error });
  }
});

module.exports = router;
