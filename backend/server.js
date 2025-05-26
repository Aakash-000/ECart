const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const apiRoutes = require('./routes/api');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;

// Configure session middleware
app.use(session({
  secret: 'your_session_secret', // Replace with a strong, unique secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' && process.env.HTTPS === 'true', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware to parse URL-encoded requests
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// Use cors middleware
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from your frontend's origin
  credentials: true // Allow cookies to be sent with the request
}));

const { connectDB } = require('./config/db');
connectDB();

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});