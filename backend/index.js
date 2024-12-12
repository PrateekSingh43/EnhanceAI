require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const z  = require("zod");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());


const User = require("./model/User")

const userValidation = require("./validation/userValidation");
const loginValidation = require('./validation/loginValidation');


const port = process.env.PORT

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors()); 


mongoose.connect(process.env.DATABASEURL)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


    app.post("/api/signup", async (req, res) => {
        try {
          // Step 1: Validate input
          const userData = userValidation.safeParse(req.body);
      
          if (!userData.success) {
            return res.status(400).json({
              error: "Validation failed",
              details: userData.error.errors,
            });
          }
      
          const { username, email, password, age } = userData.data;
      
          // Step 2: Check user existence
          const existingUser = await User.findOne({ $or: [{ username }, { email }] });
          if (existingUser) {
            return res.status(400).json({ error: "User already exists, please login" });
          }
      
          // Step 3: Hash password
          const salt = await bcrypt.genSalt(12);
          const hashedPassword = await bcrypt.hash(password, salt);
      
          // Step 4: Save user to database
          const newUser = new User({ username, email, password: hashedPassword, age });
          await newUser.save();
      
         
    
      
        } catch (error) {
          console.error("Error during signup:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
      

app.post("/api/login", async (req, res) => {
  try {
    // Step 1: Validate input
    const userLogin = loginValidation.safeParse(req.body);

    if (!userLogin.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: userLogin.error.errors,
      });
    }

    const { email, password } = userLogin.data;

    // Step 2: Check user existence
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Step 3: Compare password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Step 4: Generate JWT token
    const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Step 5: Set token in cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents access from JavaScript
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Step 6: Send success response
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/*
 login detail to check 
 
{
  "email": "testuser@example.com",
  "password": "Password123!"
}

*/






















app.listen(port, () => {
    console.log("Listening on port:", port);
});