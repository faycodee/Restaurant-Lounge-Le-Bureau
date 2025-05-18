const twilio = require("twilio");
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsAppNotification = async (action, reservationDetails) => {
  try {
    if (action === "create") {
      // Use content template for new reservations
      return await client.messages.create({
        contentSid: "HXb5bef39ba2ded763c3a95da1dc226bb3",
        contentVariables: JSON.stringify({
          1: reservationDetails.customer_name,
          2: reservationDetails.reservation_date,
          3: reservationDetails.reservation_time,
          4: reservationDetails.guests.toString(),
          5: reservationDetails.customer_phone,
          6: reservationDetails.email || "N/A",
          7: reservationDetails._id.toString(),
        }),
        from: "whatsapp:+14155238886",
        to: "whatsapp:+212608494998",
      });
    } else if (action === "delete") {
      // Use custom message for deletions
      return await client.messages.create({
        body: `🟥 Reservation has been Deleted:\n\n 📎 name: ${reservationDetails.customer_name}\n 📎 date: ${reservationDetails.reservation_date}\n 📎 time: ${reservationDetails.reservation_time}\n 📎 guests: ${reservationDetails.guests}\n 📎 status: ${reservationDetails.status}\n\n ☎️ contact:\n${reservationDetails.customer_phone}\n${reservationDetails.email}`,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+212608494998",
      });
    } else if (action === "update") {
      // Use custom message for updates
      return await client.messages.create({
        body: `📝 Reservation Updated:\n\n 📎 name: ${reservationDetails.customer_name}\n 📎 date: ${reservationDetails.reservation_date}\n 📎 time: ${reservationDetails.reservation_time}\n 📎 guests: ${reservationDetails.guests}\n 📎 status: ${reservationDetails.status}\n\n ☎️ contact:\n${reservationDetails.customer_phone}\n${reservationDetails.email}`,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+212608494998",
      });
    }
  } catch (error) {
    console.error("WhatsApp notification error:", error);
    throw error;
  }
};

// Add webhook handler
const handleWebhook = async (payload, fromNumber) => {
  try {
    if (!payload) return false;

    const [action, reservationId] = payload.split("_");
    
    // Update reservation status
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId, 
      { status: action },
      { new: true }
    );

    // Send confirmation
    if (updatedReservation) {
      await client.messages.create({
        body: `✅ Reservation ${reservationId} updated to "${action}"`,
        from: "whatsapp:+14155238886",
        to: fromNumber,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Webhook handling error:", error);
    return false;
  }
};

module.exports = { 
  sendWhatsAppNotification,
  handleWebhook 
};