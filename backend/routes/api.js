const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Import the database pool

// Import PayPal SDK
const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal Client
// Replace with your actual PayPal Client ID and Client Secret
const environment = new paypal.core.SandboxEnvironment('YOUR_PAYPAL_CLIENT_ID', 'YOUR_PAYPAL_CLIENT_SECRET');

// Route to get all products
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products'); // Assuming you have a 'products' table
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
});

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


const client = new paypal.core.PayPalHttpClient(environment);


router.get('/capture-paypal-order', (req, res) => {
  res.json({ message: 'capture-paypal-order route' });
});

router.post('/create-payment-intent', (req, res) => {
  res.json({ message: 'create-payment-intent route' });
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

module.exports = router;