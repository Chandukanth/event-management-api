const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/bookings", bookingController.createBooking);
router.get("/bookings/:userId", bookingController.getUserBookings);
router.get("/admin/bookings", bookingController.getAllBookings); // For admin

module.exports = router;
