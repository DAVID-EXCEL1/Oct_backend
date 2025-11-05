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