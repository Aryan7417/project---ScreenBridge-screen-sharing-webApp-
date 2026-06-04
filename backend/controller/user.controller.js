const User = require("../model/user.model.js")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    await User.create({
        name,
        email,
        password,
    });

    return res.render("home");
}


const signup = async (req, res) => {
  console.log("REQ BODY", req.body);

  let { username, email, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
    //   if (err) return res.status(500).send("Hashing error");

      let createUser = await User.create({
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
};


const login =  async function (req, res) {
  console.log("login BODY",req.body)
  let user = await User.findOne({ email: req.body.email })
  console.log("userFOund",user)
  if (!user) return res.send("someoen want wrong")


    // Compare the giver  Password
  bcrypt.compare(req.body.password, user.password, function (err, result) {

    if (result) {
      let token = jwt.sign({email:user.email}, "shhhhhhhhhhhhh");
      res.cookie("token", token);
      res.send("yes you can login")
    }
      else res.send("chuiya hai kkyy nhi hai tera account is maii")
  })
}

const signout = async(req, res) => {
  res.clearCookie("token");
  res.send("Logged out");
};




module.exports = {
    handleUserSignup
    ,signup
    ,login
    ,signout
};