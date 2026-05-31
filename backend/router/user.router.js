const express = require("express")
const {handleUserSignup} = require("../controller/user.controller.js")

const router = express.Router()

router.post("/",handleUserSignup)
module.exports= router
