const  mongoose = require('mongoose')
require("dotenv").config();

const connectDB = () => {
  mongoose.connect(process.env.mongo_URL)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ MongoDB Connection Failed:", err));
};


module.exports = connectDB

//Aryan435@gmail.com  as34@hdh.ocm