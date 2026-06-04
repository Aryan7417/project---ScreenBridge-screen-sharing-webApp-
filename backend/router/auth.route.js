const express = require("express")
const router = express.Router();
const {handleUserSignup
     ,signup,
     login,
     signout} = require("../controller/user.controller.js")



//const router = express.Router()

router.post("/",handleUserSignup)
router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",signout)

module.exports = router;