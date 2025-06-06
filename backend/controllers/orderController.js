// backend/controllers/orderController.js
const OrderModel = require('../models/orderModel'); // Import the SQL-based OrderModel

// @desc    Get order details by ID
// @route   GET /api/orders/:orderId
// @access  Public (adjust access based on your authentication)
const getOrderById = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await OrderModel.findOrderById(orderId); // Call the SQL-based model function

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);

  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (adjust access based on your authentication)
const createOrder = async (req, res) => {
  // In a real application, you would get order data from the request body
  // and user information from the authenticated user.
  const orderData = req.body; // Assuming order data is in the request body

  try {
    const createdOrder = await OrderModel.createOrder(orderData); // Call the SQL-based model function

    res.status(201).json(createdOrder); // 201 for resource created

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add other controller functions for updating, deleting orders, etc.

module.exports = {
  getOrderById,
  createOrder,
};
