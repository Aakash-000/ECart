const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Redis = require('ioredis');
const connectRedis = require('connect-redis');
const apiRoutes = require('./routes/api'); // Import routes from ./routes/api

const app = express();
const port = process.env.PORT || 3000;

// Configure Redis client
const redisClient = new Redis();

// Configure Redis store for sessions
const RedisStore = connectRedis(session);

// Configure session middleware
app.use(session({
  store: new RedisStore({ client: redisClient }),
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

// Use the imported API routes
app.use('/api', apiRoutes); // Assuming your API routes are under '/api'

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});