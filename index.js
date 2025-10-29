const express = require("express")
const app = express()
const ejs = require("ejs")
const dotenv = require("dotenv")
dotenv.config()
const PORT = process.env.PORT || 5000
const mongoose = require("mongoose")
const MongoDB_URI = process.env.MongoDB_URI
app.set("view engine", "ejs")
const bcrypt = require("bcryptjs");
const saltRounds = 10;






// MVCR Architechture

// Set your bodyparser
// In Node.js, when someone sends data to your server (for example, filling a form and clicking submit), that data doesn’t automatically come as a nice object. Instead, it usually comes in a raw format like a string or buffer.

// Body-parser is like a translator.
// It takes that raw incoming request data and converts it into a usable JavaScript object, so you can easily access it in your code.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Connect to MongoDB
mongoose.connect(MongoDB_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Schema and Model definition can go here
let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        match: [/^[A-Za-z]+$/, "First name must contain only letters"],
        trim: true,
    },

    lastName: {
        type: String,
        required: [true, "Last name is required"],
        match: [/^[A-Za-z]+$/, "Last name must contain only letters"],
        trim: true,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email has been taken, please choose another one"],
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please provide a valid email address",
        ],
        lowercase: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        // match: [
        //     /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        //     "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character",
        // ],
    },
})
let User = mongoose.model("User", userSchema)



// let allStudents = [
//     { id: 1, name: "Felix", age: 60, accountBalance: 500000, course: "Software Engineer" },
//     { id: 2, name: "Emini", age: 20, accountBalance: 200000, course: "Data Science" },
//     { id: 3, name: "Tobi", age: 25, accountBalance: 300000, course: "Cyber Security" },
//     { id: 4, name: "Bola", age: 30, accountBalance: 400000, course: "UI/UX Design" },
//     { id: 5, name: "Seyi", age: 35, accountBalance: 600000, course: "Digital Marketing" },
//     { id: 6, name: "Tunde", age: 40, accountBalance: 700000, course: "Product Management" },
//     { id: 7, name: "Ayo", age: 45, accountBalance: 800000, course: "Business Analysis" },
//     { id: 8, name: "Kunle", age: 50, accountBalance: 900000, course: "Project Management" },
//     { id: 9, name: "Chidi", age: 55, accountBalance: 1000000, course: "Cloud Computing" },
//     { id: 10, name: "Ngozi", age: 28, accountBalance: 450000, course: "DevOps" },
//     { id: 11, name: "Emeka", age: 32, accountBalance: 550000, course: "AI and Machine Learning" },
// ]


app.get("/", (req, res) => {
    res.send("Nibo we don welcome you yesterday")
})

app.get("/emini", (req, res) => {
    // console.log(__dirname)
    res.sendFile(__dirname + "/index.html")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})
app.post("/register", (req, res) => {
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
            res.redirect("/signin");
        })
        .catch((err) => {
            if (err !== "User already exists") {
                console.error("Error saving user:", err);
                res.status(500).send("Internal Server Error");
            }
        });
});

app.get("/signin", (req, res) => {
    res.render("signin")
})

app.post("/login", (req, res) => {
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
                        res.redirect("/dashboard");
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
app.get("/dashboard", (req, res) => {
    res.render("dashboard", { gender: "Female" })
})

app.get("/students", (req, res) => {
    res.send(allStudents)
})
app.listen(PORT, (err) => {
    if (err) {
        console.log("Error occurred while starting the server:", err);
    } else {
        console.log("App is running on port 5000");
    }
})


// Authentication Steps
// Check for empty input
// Validate strong password
// Check if user already exists
// Hash password
// Save new user

// Login Steps
// Check for empty input
// Find user by email
// Compare password
// Grant or deny access

// AUTHENTICATION - To check if a user is authentic, To confirm if a user exists. 
// AUTHORIZATION - Gives the user access and privileges to protected resources
// - To check if an authentic user has the right to access certain resources.