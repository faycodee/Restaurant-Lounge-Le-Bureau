const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const chatbotRoutes = require('./routes/dishSuggestionRoutes');

// Verify required environment variables
const requiredEnvVars = ["MONGO_URI", "SECRET_KEY", "PORT"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is not set in environment variables`);
    process.exit(1);
  }
}

// Make SECRET_KEY available globally
global.SECRET_KEY = process.env.SECRET_KEY;

const app = express();
const reservationRoutes = require("./routes/reservationRoutes");
const usersRoutes = require("./routes/usersRoutes");
const couponRoutes = require("./routes/couponRoutes");
// const dishSuggestionRoutes = require("./routes/dishSuggestionRoutes");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/dish-suggestions", dishSuggestionRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.post("/api/reservations/twilio-webhook", async (req, res) => {
  const success = await handleWebhook(req.body.ButtonPayload, req.body.From);
  res.sendStatus(success ? 200 : 400);
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment variables loaded:", {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI?.substring(0, 20) + "...",
    SECRET_KEY: process.env.SECRET_KEY ? "SET" : "NOT SET",
  });
});
