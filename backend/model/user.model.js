const  mongoose = require('mongoose')
require("dotenv").config();


//uri="mongodb+srv://aryan:aryan@cluster0.ff94sfu.mongodb.net/aryan?appName=Cluster0"

mongoose.connect(process.env.mongo_URL)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌", err));

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    age : Number
})

module.exports = mongoose.model("user",userSchema)