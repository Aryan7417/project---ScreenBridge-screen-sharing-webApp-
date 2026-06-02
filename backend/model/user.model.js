const  mongoose = require('mongoose')
require("dotenv").config();


mongoose.connect(process.env.mongo_URL)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌", err));

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    
})

module.exports = mongoose.model("user",userSchema)

