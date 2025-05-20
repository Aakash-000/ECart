const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Import the database pool
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const authenticatedRouter = express.Router(); // Create a separate router for authenticated routes
// Import PayPal SDK
const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal Client
// Replace with your actual PayPal Client ID and Client Secret

// Middleware to check if user is authenticated via session
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    // User is authenticated, proceed to the next middleware or route handler
    return next();
  }
 else {
    // User is not authenticated, return 401 Unauthorized
    return res.sendStatus(401); // If there's no token, return 401 Unauthorized

  }

  }

// Middleware to verify JWT
function verifyJWT(req, res, next) {
  const token = req.cookies.token; // Get token from the 'token' cookie

  if (!token) {
    return res.sendStatus(401); // If there's no token, return 401 Unauthorized
  }

  const jwtSecret = process.env.JWT_SECRET || 'YOUR_DEFAULT_SECRET'; // Use environment variable or a default

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // If token is invalid, return 403 Forbidden
    }
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
}



const environment = new paypal.core.SandboxEnvironment('YOUR_PAYPAL_CLIENT_ID', 'YOUR_PAYPAL_CLIENT_SECRET');

// Apply verifyJWT middleware to the authenticated router
authenticatedRouter.use(verifyJWT);
// Route for user signup 
router.post('/signup', async (req, res) => { 
  const { email, password } = req.body; 

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Check if user already exists 
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]); 
    if (existingUser.rows.length > 0) { 
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    // Hash the password
    const saltRounds = 10; // Recommended salt rounds for bcrypt
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database 
    await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, password_hash]); 
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'An error occurred during signup.' });
  }
}); 

// Route for user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find the user by email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Passwords match, create a JWT
    const jwtSecret = process.env.JWT_SECRET || 'YOUR_DEFAULT_SECRET'; // Use environment variable or a default
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      jwtSecret,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Set the JWT in an HttpOnly, Secure, and SameSite cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.HTTPS === 'true', // Set to true only in production with HTTPS
      sameSite: 'Lax', // Or 'Strict' depending on your needs
    });
    res.status(200).json({ message: 'Login successful.' });
  }  catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

const client = new paypal.core.PayPalHttpClient(environment);

// Route to get all products
authenticatedRouter.get('/products', async (req, res) => {
 try {
 const result = await pool.query('SELECT * FROM products'); // Assuming you have a 'products' table
 res.json(result.rows);
 } catch (err) {
 console.error('Error fetching products:', err);
 res.status(500).json({ error: 'An error occurred while fetching products.' });
 }
});

// Route to get a single product by ID
authenticatedRouter.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
});



authenticatedRouter.get('/capture-paypal-order', (req, res) => {
  res.json({ message: 'capture-paypal-order route' });
});

authenticatedRouter.post('/create-payment-intent', (req, res) => {
  res.json({ message: 'create-payment-intent route' });
});
// Route for user logout
// New route to get authenticated user data
authenticatedRouter.get('/user', (req, res) => {
  res.status(200).json({ user: req.user });
});
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the 'token' cookie
  res.status(200).json({ message: 'Logged out successfully' });
});

router.post('/create-paypal-order', (req, res) => {
  // Create a request to create an order
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '100.00' // Replace with actual order total
      },
      items: [ // Replace with actual item details
        {
          name: 'Example Item',
          unit_amount: {
            currency_code: 'USD',
            value: '100.00'
          },
          quantity: '1'
        }
      ]
    }]
  });

  client.execute(request).then(response => {
    res.json({ orderID: response.result.id });
  }).catch(err => {
    console.error(err);
    res.status(500).send('Error creating PayPal order');
  });
});


router.post('/webhook', (req, res) => {
  res.json({ message: 'webhook route' });
});

// New route to check authentication status
authenticatedRouter.get('/authenticated', (req, res) => {
  res.status(200).json({ message: 'Authenticated', user: req.user });
});

// Mount the authenticated router
router.use('/', authenticatedRouter);

module.exports = router;