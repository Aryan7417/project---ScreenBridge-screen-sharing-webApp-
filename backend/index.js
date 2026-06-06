const express = require('express')
const app = express()


const User = require('../backend/model/user.model.js')
const authRoutes = require('../backend/router/auth.route.js')
const connectDB= require('../backend/config/db.config.js')
const  router = require('../backend/router/auth.route.js')
const socketHandler = require('./sockets/socketHandler.js')

const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");
const http= require('http')
const server = http.createServer(app);


const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"]
  }
});
socketHandler(io);





app.get("/",(req,res)=>{
    res.send("Backend Running");
});

// server.listen(3000,()=>{
//     console.log("Server Running On Port 3000");
// });













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



//app.listen(3000,()=> console.log("Server is runnning on PORT 3000"))

server.listen(3000,()=>{
  console.log("serever is Running on port 3000")
})





