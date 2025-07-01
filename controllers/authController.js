const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, city, state, country } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      city,
      state,
      country
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: 'kruthichandu23@gmail.com',
          subject: `SOme one login`,
          html: `<p>Hi some one login</p>
                 <p>Your ticket for <strong></strong> has been booked successfully.</p>
                 <p><b>Date:</b>  <br/>
                 <b>Venue:</b></p>
                 <p>Thank you!</p>`
        });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
