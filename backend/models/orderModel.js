// backend/models/orderModel.js
const { pool } = require('../config/db'); // Import the database pool

const OrderModel = {
  /**
   * Finds an order in the database by ID.
   * @param {string} orderId The ID of the order.
   * @returns {Promise<object | undefined>} A promise that resolves with the order data or undefined if not found.
   */
  async findOrderById(orderId) {
    try {
      const result = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
      return result.rows[0]; // Return the first row (the order) or undefined
    } catch (error) {
      console.error('Error finding order by ID:', error);
      throw error; // Re-throw the error for the controller to handle
    }
  },


  async findOrdersByUserId(userId) {
    try {
      const ordersResult = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]); // Adjust user_id column name and add ordering
      const orders = ordersResult.rows;

      // For each order, fetch its items
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const itemsResult = await pool.query('SELECT name, quantity, price FROM order_items WHERE order_id = $1', [order.id]); // Adjust table and column names
        return {
          ...order,
          items: itemsResult.rows,
        };
      }));

      return ordersWithItems;

    } catch (error) {
      console.error('Error finding orders by user ID:', error);
      throw error; // Re-throw the error
    }
  },
  /**
   * Creates a new order in the database.
   * @param {object} orderData The data for the new order.
   * @returns {Promise<object>} A promise that resolves with the created order's data.
   */
  async createOrder(orderData) {
    const { items, shippingAddress, paymentMethod, total,user_id } = orderData;
    const order_number = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`; // Generate a unique order number

    try {
      // Insert the main order details
      const result = await pool.query(
        'INSERT INTO orders (order_number, total, payment_method, shipping_address_line1, shipping_address_city, shipping_address_state, shipping_address_postal_code,user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [order_number, total, paymentMethod, shippingAddress.line1, shippingAddress.city, shippingAddress.state, shippingAddress.postal_code,user_id]
      );

      const createdOrder = result.rows[0];
      const orderId = createdOrder.id;
      console.log(createdOrder)
      // Insert order items (assuming you have an order_items table)
      if (items && items.length > 0) {
        const itemQueries = items.map(item =>
          pool.query(
            'INSERT INTO order_items (order_id, name, quantity, price) VALUES ($1, $2, $3, $4)',
            [orderId, item.name, item.quantity, item.price]
          )
        );
        await Promise.all(itemQueries); // Execute all item insertion queries
      }

      // You might need to fetch the created order again with items joined if your schema requires it
      // For simplicity, we'll return the main order details here.
      return createdOrder;

    } catch (error) {
      console.error('Error creating order:', error);
      throw error; // Re-throw the error
    }
  },

  async getOrderItems(orderId) {
    try {
      const result = await pool.query(
        'SELECT name, quantity, price FROM order_items WHERE order_id = $1', // Adjust table and column names as per your schema
        [orderId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  },
  // Add other SQL-based functions for updating, deleting orders, etc.
};

module.exports = OrderModel;
