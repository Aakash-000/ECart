const {pool} = require('../config/db');

const ProductImageModel = {
  createProductImage: async (product_id, image_url, alt_text, order_num) => {
    try {
      const result = await pool.query(
        'INSERT INTO product_images (product_id, image_url, alt_text, order_num) VALUES ($1, $2, $3, $4) RETURNING *',
        [product_id, image_url, alt_text, order_num]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating product image:', error);
      throw error;
    }
  },
};

module.exports = ProductImageModel;