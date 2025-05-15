const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api'); // Import routes from ./routes/api

const app = express();
const port = process.env.PORT || 3000;

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