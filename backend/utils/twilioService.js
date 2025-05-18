const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendWhatsAppNotification = async (action, reservationDetails) => {
  try {
    const message = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+212608494998',
      contentSid: 'HXb5bef39ba2ded763c3a95da1dc226bb3',
      contentVariables: JSON.stringify({
        "1": reservationDetails.name,
        "1": reservationDetails.date,
        "2": reservationDetails.time,
        "3": action,
        "4": reservationDetails.numberOfPeople || '',
        "5": reservationDetails.customerName || ''
      })
    });
    console.log('WhatsApp notification sent:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    throw error;
  }
};

module.exports = { sendWhatsAppNotification };