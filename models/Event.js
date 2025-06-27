const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  image: String,
  shortDescription: String,
  description: String,
  date: String,
  time: String,
  venue: String,
  ticketCount: Number,
  ticketCost: Number,
  meta: {
    title: String,
    description: String,
    keywords: String,
    url: String
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
