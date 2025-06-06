const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Import the database pool
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const authenticatedRouter = express.Router(); // Create a separate router for authenticated routes
// Import PayPal SDK
const { upload } = require('../middleware/uploadMiddleware');
const paypal = require('@paypal/checkout-server-sdk');
const { isAuthenticated, verifyJWT } = require('../middleware/authMiddleware');
const UserController = require('../controllers/userController');
const ProductController = require('../controllers/productController');
const  CategoryController  = require('../controllers/categoryController');
const multer = require('multer');

// Import Stripe library
const stripe = require('stripe')('sk_test_51RKMShQk4GZEsTMa6GrjEtv4SUn8pF7gbvQO37makh8EuzzopkPZ0JgOMYrIWSmOhlTdJ5AALJv0UcPc000zn5h800aVOzQqJs'); // Replace with your actual Stripe Secret Key


// Configure PayPal Client
// Replace with your actual PayPal Client ID and Client Secret

const environment = new paypal.core.SandboxEnvironment('YOUR_PAYPAL_CLIENT_ID', 'YOUR_PAYPAL_CLIENT_SECRET');

// Apply verifyJWT middleware to the authenticated router
authenticatedRouter.use(verifyJWT);

// Product routes
authenticatedRouter.get('/products', ProductController.getAllProducts);
authenticatedRouter.get('/products/:id', ProductController.getProductById);
console.log('Hit /api/products/upload route');
// New route for image upload
authenticatedRouter.post('/products', upload.single('image'), ProductController.createProduct);



// Route to add a new category
authenticatedRouter.post('/categories', CategoryController.createCategory);

// Route to get all categories
authenticatedRouter.get('/categories', CategoryController.getAllCategories);



const client = new paypal.core.PayPalHttpClient(environment);

// Route to get all products



authenticatedRouter.get('/capture-paypal-order', (req, res) => {
  res.json({ message: 'capture-paypal-order route' });
});

authenticatedRouter.post('/create-payment-intent', (req, res) => {
  const { amount } = req.body;

  stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
  })
  .then(paymentIntent => {
    res.json({ clientSecret: paymentIntent.client_secret });
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
});
// New route to get authenticated user data
authenticatedRouter.get('/user', (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post('/login', UserController.login);

router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax' }); // Explicitly set secure to false for development
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

router.post('/signup', UserController.signup);

// Mount the authenticated router
router.use('/', authenticatedRouter);


module.exports = router;