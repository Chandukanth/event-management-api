const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  phoneNumber: String,
  city: String,
  state: String,
  country: String,
  ticketCost: Number
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
