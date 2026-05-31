const express = require('express')
const path = require("path")

const userRoute = require("./router/user.router.js")
const router = express.Router()

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/user",userRoute)
app.use("/", router);


router.get("/signup",(req,res)=>{
  res.send("signup")
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})