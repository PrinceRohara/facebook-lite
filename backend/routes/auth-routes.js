const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const user = new User({ username });
    await user.setPassword(password);
    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully.", user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// login route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", info.message);
      return res
        .status(401)
        .json({ mes: "usernames and passoword not correct" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const { username, _id } = user;
      res
        .status(201)
        .json({ success: true, mes: "login success", user: { username, _id } });
    });
  })(req, res, next);
});

module.exports = router;
