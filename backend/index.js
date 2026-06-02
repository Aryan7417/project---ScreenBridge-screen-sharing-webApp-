const express = require('express')
const app = express()
const userModel = require('../backend/model/user.model.JS')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const path = require('path')

const cors = require("cors");

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

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html")
  );
});

app.post('/signup', (req, res) => {
  console.log("REQ BODY",req.body)

  let { username, email, password, } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {

      let createUser = await userModel.create({
        username,
        password: hash,
        email,

      });

      console.log("USER CREATED:", createUser);


      let token = jwt.sign({ email }, "shhhhhhhhhhhhh");

      res.cookie("token", token);

      res.send(createUser);
    });
  });

});



app.post('/login', async function (req, res) {
  console.log("login BODY",req.body)
  let user = await userModel.findOne({ email: req.body.email })
  console.log("userFOund",user)
  if (!user) return res.send("someoen want wrong")

  bcrypt.compare(req.body.password, user.password, function (err, result) {

    if (result) {
      let token = jwt.sign({email:user.email}, "shhhhhhhhhhhhh");
      res.cookie("token", token);
      res.send("yes you can login")
    }
      else res.send("chuiya hai kkyy nhi hai tera account is maii")
  })
})



app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logged out");
});



app.listen(3000)



























