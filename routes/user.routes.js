const express = require("express")
const router = express.Router()
const { getNew, getDash , getSignup, getSignin, getAllStudents, getDashboard, postRegister, postLogin} = require("../controllers/user.controllers")
const { verifyToken } = require("../middleware/auth.middleware")


router.get("/", getDash)

router.get("/emini", getNew)

router.get("/signup", getSignup ) 

router.post("/register", postRegister);

router.get("/signin", getSignin)

router.post("/login", postLogin);

// Protected routes - require JWT token
router.get("/dashboard", verifyToken, getDashboard)

router.get("/students", verifyToken, getAllStudents)


module.exports = router;