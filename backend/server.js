const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const reservationRoutes = require("./routes/reservationRoutes");
const usersRoutes = require("./routes/usersRoutes");

require("dotenv").config(); // لاستخدام المتغيرات البيئية
const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.error(err));

// إعداد ميدل وير
app.use(express.json());
app.use(cors());

app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", usersRoutes);
// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
