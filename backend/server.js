const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const apiRoutes = require('./routes/api');

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

// Basic route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});