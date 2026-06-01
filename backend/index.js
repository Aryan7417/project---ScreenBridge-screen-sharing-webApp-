// const express = require('express')
// const path = require("path")

// const userRoute = require("./router/user.router.js")
// const router = express.Router()

// const app = express()
// const port = 3000

// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

// app.use("/user",userRoute)
// app.use("/", router);


// router.get("/signup",(req,res)=>{
//   res.send("signup")
// })




// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })   


//---------------------------------------------------------------------------------------------------------------------

const express = require('express')
const app = express()
const userModel = require('../backend/model/user.model.js')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const path = require('path')

app.set('view engine', 'ejs');

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
  res.render("indexx")
})

app.post('/create', (req, res) => {

  let { username, email, password, age } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {

      let createUser = await userModel.create({
        username,
        password: hash,
        email,
        age,

      });


      let token = jwt.sign({ email }, "shhhhhhhhhhhhh");

      res.cookie("token", token);

      res.send(createUser);
    });
  });

});

app.get('/login', function (req, res) {
  res.render("login")
})


app.post('/login', async function (req, res) {
  let user = await userModel.findOne({ email: req.body.email })
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



app.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.redirect("/")
})




app.listen(3000)






























