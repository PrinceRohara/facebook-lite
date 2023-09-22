const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  likes: { type: Number, default: 0 }, 
});

module.exports = mongoose.model("Image", imageSchema);
