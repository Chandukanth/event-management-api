const Booking = require("../models/Booking");
const Event = require("../models/Event");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.createBooking = async (req, res) => {
  try {
    const { eventId, name, email, phoneNumber, city, state, country, userId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.ticketCount <= 0) return res.status(400).json({ message: "Tickets sold out" });

    const booking = new Booking({
      eventId,
      name,
      email,
      userId,
      phoneNumber,
      city,
      state,
      country,
      ticketCost: event.ticketCost
    });

    await booking.save();

    // reduce ticket count
    event.ticketCount -= 1;
    await event.save();

    // send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Booking Confirmation - ${event.name}`,
      html: `<p>Hi ${name},</p>
             <p>Your ticket for <strong>${event.name}</strong> has been booked successfully.</p>
             <p><b>Date:</b> ${event.date} ${event.time}<br/>
             <b>Venue:</b> ${event.venue}</p>
             <p>Thank you!</p>`
    });

    res.status(201).json({ message: "Booking confirmed and email sent." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate("eventId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("eventId userId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
