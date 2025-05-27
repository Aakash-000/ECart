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
authenticatedRouter.get('/products', async (req, res) => {
 try {
 const result = await pool.query('SELECT * FROM products'); // Assuming you have a 'products' table
 res.json(result.rows);
 } catch (err) {
 console.error('Error fetching products:', err);
 res.status(500).json({ error: 'An error occurred while fetching products.' });
 }
}); // Removed duplicate route, this was likely unintended

 // This needs to use authenticatedRouter
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

// Mount the authenticated router
router.use('/', authenticatedRouter);

router.post('/signup', UserController.signup);
module.exports = router;