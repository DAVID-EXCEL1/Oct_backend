const express = require("express")
const app = express()
const ejs = require("ejs")
const dotenv = require("dotenv")
dotenv.config()
const PORT = process.env.PORT || 5000
const mongoose = require("mongoose")
const MongoDB_URI = process.env.MongoDB_URI
app.set("view engine", "ejs")
const userRoutes = require("./routes/user.routes")


// MVCR Architechture

// Set your bodyparser
// In Node.js, when someone sends data to your server (for example, filling a form and clicking submit), that data doesn’t automatically come as a nice object. Instead, it usually comes in a raw format like a string or buffer.

// Body-parser is like a translator.
// It takes that raw incoming request data and converts it into a usable JavaScript object, so you can easily access it in your code.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoutes)
// Connect to MongoDB
mongoose.connect(MongoDB_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Schema and Model definition can go here





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