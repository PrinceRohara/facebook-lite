// app.js
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth-routes");
const connectDB = require("./db/db");
require("dotenv").config();
const flash = require("connect-flash");
const Image = require("./models/Image");
const multer = require("multer");
const app = express();
const cors = require("cors");
const path = require("path");

// Configure MongoDB connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

require("./passport-config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { filename } = req.file;

    const image = new Image({ filename, likes: 0 });
    await image.save();

    res.status(201).json({ message: "Image uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//  auth routes
app.use("/auth", authRoutes);

app.put("/like/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    image.likes += 1;
    await image.save();

    res.json({ likes: image.likes });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await Image.find({}).sort({ likes: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
