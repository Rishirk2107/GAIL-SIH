const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require("dotenv").config()

const authRoutes=require("./routes/authRoutes");
const issueRoute=require("./routes/issueRoute");

const PORT=process.env.PORT;

const app=express();

app.use(cors({
    origin: 'http://localhost:5173', // React app origin
    credentials: true // Allow cookies and sessions to be included
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: false, // Ensure this is set to false for HTTP
    } 
}));


app.use("/auth",authRoutes);
app.use("/issue",issueRoute);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});