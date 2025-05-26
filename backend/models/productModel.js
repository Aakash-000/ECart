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

  createProduct: async ({ name, description, price, sku, category_id, brand, weight, dimensions }) => {
    try {
      const result = await pool.query(
        'INSERT INTO products (name, description, price, sku, category_id, brand, weight, dimensions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [name, description, price, sku, category_id, brand, weight, dimensions]
      );
      return result.rows[0]; // Return the newly created product
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  },
};

module.exports = ProductModel;