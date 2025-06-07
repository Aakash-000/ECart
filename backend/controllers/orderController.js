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

// @desc    Finalize order after successful payment
// @route   POST /api/orders/finalize
// @access  Private (adjust access based on your authentication)
const finalizeOrder = async (req, res) => {
  // ...
  try {
    const createdOrder = await OrderModel.createOrder(orderData); // This returns the main order details
    const orderId = createdOrder.id;

    // Fetch order items (assuming you have an order_items table and a function to fetch items by order ID)
    const orderItems = await OrderModel.getOrderItems(orderId); // You'll need to implement this function

    // Format the response to match the frontend's OrderDetails interface
    const formattedOrderDetails = {
      orderNumber: createdOrder.order_number,
      date: createdOrder.created_at, // Assuming you have a created_at column
      total: createdOrder.total.toString(), // Convert total to string
      paymentMethod: createdOrder.payment_method,
      items: orderItems.map(item => ({ // Map backend item structure to frontend
        name: item.name,
        quantity: item.quantity,
        price: item.price.toString(), // Convert price to string
      })),
      shippingAddress: {
        line1: createdOrder.shipping_address_line1,
        city: createdOrder.shipping_address_city,
        state: createdOrder.shipping_address_state,
        postal_code: createdOrder.shipping_address_postal_code,
      },
      // Add other fields if needed
    };

    res.status(201).json(formattedOrderDetails); // Send the formatted data
  } catch (error) {
    // ...
    console.error('Error finalizing order:', error);
    res.status(500).json({ message: 'Internal server error' });

  }
};


// Add other controller functions for updating, deleting orders, etc.

module.exports = {
  getOrderById,
  createOrder,
  finalizeOrder,
};


// backend/controllers/orderController.js

// const finalizeOrder = async (req, res) => {
//     try {
//       // TODO: Extract order data from req.body
//       const { items, shippingAddress, paymentIntentId, total } = req.body; // Example of expected data

//       // You might also want to get the user ID from the authenticated user (req.user)

//       // TODO: Validate the received data

//       // TODO: Generate a unique order number
//       const orderNumber = generateUniqueOrderNumber();

//       const orderData = {
//         orderNumber,
//         items,
//         shippingAddress,
//         // TODO: Get payment method from paymentIntent or req.body
//         paymentMethod: 'Stripe', // Placeholder
//         total,
//         // TODO: Add user ID if applicable
//         // user: req.user._id,
//       };

//       const createdOrder = await OrderModel.createOrder(orderData);

//       res.status(201).json(createdOrder);

//     } catch (error) {
//       console.error('Error finalizing order:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };

//   // TODO: Implement generateUniqueOrderNumber function
//   function generateUniqueOrderNumber() {
//     // Implement your logic to generate a unique order number
//     return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
//   }

//   module.exports = {
//     getOrderById,
//     createOrder, // You might not need to expose this if orders are only created via finalizeOrder
//     finalizeOrder,
//   };
