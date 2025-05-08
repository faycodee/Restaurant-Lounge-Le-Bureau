const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  loyaltyPoints: { type: Number, default: 0 }, // Added loyaltyPoints field
});

const Users = mongoose.model("Users", UsersSchema);
module.exports = Users;
