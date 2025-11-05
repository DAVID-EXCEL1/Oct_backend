const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const User = require("../models/user.models")


router.get("/", (req, res) => {
    res.send("Nibo we don welcome you yesterday")
})

router.get("/emini", (req, res) => {
    // console.log(__dirname)
    res.sendFile(__dirname + "/index.html")
})

router.get("/signup", (req, res) => {
    res.render("signup")
})
router.post("/register", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);

    // Step 1 is to Validate strong password  // Regex isMatch
    const strongPasswordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        return res.status(400).send(
            "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character"
        );
    }

    // Step 2 is to Check if user already exists to prevent more than one registrations
    User.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                res.status(400).send("Email already exists!");
                return Promise.reject("User already exists"); // Stop the chain - completion of  an async operation
            }
            // Step 3 is to Hash password
            return bcrypt.hash(password, saltRounds);
        })
        .then((hashedPassword) => {
            if (!hashedPassword) return; // If user exists, skip this step, it is optional
            // Step 4 is to Save new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword, // Store hashed password not the plain text password
            });

            return newUser.save();
        })
        .then((savedUser) => {
            if (!savedUser) return; // If user exists, skip this step, it is also optional
            console.log("User registered successfully");
            // Node Mailer logic can go here to send a welcome email
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'davidsome2004@gmail.com',
                    // a special password generated from google account settings not your original password
                    // Step one: Enable 2-step verification
                    // Step two: Generate router password
                    pass: 'xfmtxcpaixvepeiq'
                }
            });
            // This is the information about the email you are sending
            let mailOptions = {
                from: 'davidsome2004@gmail.com',
                to: [req.body.email], // list of receivers
                subject: 'Welcome to Our routerlication',
                // Welcome@David2
                // You can also send HTML formatted emails
                html: `
                    <div style="background: #f4f6fb; padding: 40px 0; font-family: 'Segoe UI', Arial, sans-serif;">
                    <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #4f8cff 0%, #38c6fa 100%); padding: 24px 32px; color: #fff; text-align: center;">
                    <h1 style="margin: 0; font-size: 2rem; font-weight: 700; letter-spacing: 1px;">Welcome to Our routerlication</h1>
                    </div>
                    <div style="padding: 32px 32px 24px 32px; text-align: center;">
                    <p style="font-size: 1.1rem; margin-bottom: 16px; color: #333;">🎉 <strong>Congratulations!</strong> Your sign-up was successful!</p>
                    <p style="font-size: 1rem; margin-bottom: 16px; color: #555;">Thank you for registering. We are excited to have you on board.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                    <p style="font-size: 0.95rem; color: #888;">Best Regards,<br><span style="font-weight: 600; color: #4f8cff;">Your routerlication Team</span></p>
                    </div>
                    </div>
                    </div>
            `,
            };
            // This is what will actually send the email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.redirect("/user/signin");
        })
        .catch((err) => {
            if (err !== "User already exists") {
                console.error("Error saving user:", err);
                res.status(500).send("Internal Server Error");
            }
        });
});

router.get("/signin", (req, res) => {
    res.render("signin")
})

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("All fields are required"); //Optional as body-parser will handle this by default
        // How body-parser works is that if a field is missing, it simply won't be present in req.body.
        // Input field is also required in the frontend that is why it is optional here
    }

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                console.log("User not found");
                return res.status(400).send("Invalid email or password");
            }

            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        console.log("Login successful");
                        res.redirect("/user/dashboard");
                    } else {
                        console.log("Invalid password");
                        res.status(400).send("Invalid email or password");
                    }
                })
                .catch((err) => {
                    console.error("Error comparing password:", err);
                    res.status(500).send("Internal Server Error");
                });
        })
        .catch((err) => {
            console.error("Error finding user:", err);
            res.status(500).send("Internal Server Error");
        });
});
router.get("/dashboard", (req, res) => {
    res.render("dashboard", { gender: "Female" })
})

router.get("/students", (req, res) => {
    res.send(allStudents)
})


module.exports = router;