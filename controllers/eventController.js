const axios = require("axios");
const FormData = require("form-data");
const Event = require("../models/Event");
const fs = require("fs");
const path = require("path");
const uploadToImgbb = async (filePath) => {
  const fileData = fs.readFileSync(filePath, { encoding: "base64" });

  const form = new FormData();
  form.append("image", fileData);

  const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, form, {
    headers: form.getHeaders(),
  });

  return response.data.data.url;
};

exports.createEvent = async (req, res) => {
  try {
    // Upload the image to imgbb
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const formData = new FormData();
    formData.append("image", file.buffer.toString("base64"));

    const imgbbRes = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData, {
      headers: formData.getHeaders()
    });

    const imageUrl = imgbbRes.data.data.url;

    // Attach image URL to body
    req.body.image = imageUrl;

    const newEvent = new Event(req.body);
    await newEvent.save();

    res.status(201).json({ message: "Event created", event: newEvent });
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    // Upload the image to imgbb
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const formData = new FormData();
    formData.append("image", file.buffer.toString("base64"));

    const imgbbRes = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData, {
      headers: formData.getHeaders()
    });

    const imageUrl = imgbbRes.data.data.url;

    // Attach image URL to body
    req.body.image = imageUrl;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imageUrl },
      { new: true }
    );

    res.json(updatedEvent);
  } catch (err) {
    console.error("Update Event Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateEventStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "Invalid 'isActive' value" });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event status updated", event: updated });
  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ message: err.message });
  }
};
