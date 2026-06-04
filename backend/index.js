const express = require('express')
const app = express()


const User = require('../backend/model/user.model.js')
const authRoutes = require('../backend/router/auth.route.js')
const connectDB= require('../backend/config/db.config.js')
const  router = require('../backend/router/auth.route.js')

const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require("cors");
require("dotenv").config();

connectDB()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(
  express.static(
    path.join(__dirname, "../frontend/dist")
  )
);
app.use("/", authRoutes);



app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html")
  );
});



app.listen(3000,()=> console.log("Server is runnning on PORT 3000"))






