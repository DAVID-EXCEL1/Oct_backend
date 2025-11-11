const express = require("express")
const router = express.Router()
const { getNew, getDash , getSignup, getSignin, getAllStudents, getDashboard, postRegister, postLogin} = require("../controllers/user.controllers")


router.get("/", getDash)

router.get("/emini", getNew)

router.get("/signup", getSignup ) 

router.post("/register", postRegister);

router.get("/signin", getSignin)

router.post("/login", postLogin);
router.get("/dashboard", getDashboard)

router.get("/students", getAllStudents)


module.exports = router;