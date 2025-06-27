const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage(); // store file in memory for upload to ImgBB
const upload = multer({ storage });

const eventController = require("../controllers/eventController");
const { verifyToken, isAdmin } = require("../middleware/auth");


// Public routes
router.get("/events", eventController.getEvents);
router.get("/events/:id", eventController.getEventById);

// Admin-protected routes with image upload
router.post("/events", verifyToken, isAdmin, upload.single("image"), eventController.createEvent);
router.put("/events/:id", verifyToken, isAdmin, upload.single("image"), eventController.updateEvent);
router.delete("/events/:id", verifyToken, isAdmin, eventController.deleteEvent);
router.patch("/events/:id/status", verifyToken, isAdmin, eventController.updateEventStatus);


module.exports = router;
