const {pool} = require('../config/db');

const ProductModel = {
  getAllProducts: async () => {
    try {
      const result = await pool.query('SELECT * FROM products');
      return result.rows;
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  },

  getProductById: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      return result.rows[0]; // Assuming ID is unique, return the first row
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      throw err;
    }
  },

  // Inside backend/models/productModel.js

  createProduct : async (name, description, price, sku, category_id, brand, weight, dimensions) => {
    try {
      console.log('ProductModel.createProduct received name:', name); // Add this line
      console.log('ProductModel.createProduct received price:', price); // Add this line
      // Add console logs for other arguments

      const result = await db.query(
        'INSERT INTO products (name, description, price, sku, category_id, brand, weight, dimensions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [name, description, price, sku, category_id, brand, weight, dimensions]
      );

      console.log('SQL query executed:', 'INSERT INTO products (name, description, price, sku, category_id, brand, weight, dimensions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'); // Log the query
      console.log('Values passed to query:', [name, description, price, sku, category_id, brand, weight, dimensions]); // Log the values


      return result.rows[0];
    } catch (error) {
      console.error('Error in ProductModel.createProduct:', error);
      throw error; // Re-throw the error to be caught by the controller
    }
  }

};

module.exports = ProductModel;