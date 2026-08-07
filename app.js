// imports
const express = require("express"); //importing express package
const app = express(); // creates a express application
const dotenv = require("dotenv").config(); //this allows me to use my .env values in this file
const morgan = require("morgan");
const cors = require("cors");

// Routes Import
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const notificationRoutes = require("./routes/notification.routes");
const saveRoutes = require("./routes/save.routes");


// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/notification", notificationRoutes);
app.use("/save", saveRoutes);


module.exports = app;
