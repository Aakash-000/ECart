const {pool} = require('../config/db');
// const db = require('../config/db');

const ProductModel = {
  getAllProducts: async () => {
    try {
      const result = await pool.query(`
        SELECT
          p.*,
          (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.order_num ASC LIMIT 1) AS image_url,
          (SELECT pi.alt_text FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.order_num ASC LIMIT 1) AS alt_text
        FROM products p
        ORDER BY p.id ASC
      `);

      return result.rows;
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  },

  getProductById: async (id) => {
    try {
      const result = await pool.query(`
        SELECT p.*, pi.image_url, pi.alt_text
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = $1
        ORDER BY pi.order_num ASC
        LIMIT 1`, [id]);
        // console.log(result)
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

      const result = await pool.query(
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