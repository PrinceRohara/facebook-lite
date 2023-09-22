const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    mongoose.set("strictQuery", false);
    const connect = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Database Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
