const {pool} = require('../config/db');

const CategoryModel = {
  getAllCategories: async () => {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY name');
      return result.rows;
    } catch (err) {
      console.error('Error fetching categories:', err);
      throw new Error('An error occurred while fetching categories.');
    }
  },

  createCategory: async (name, parent_id) => {
    try {
      const result = await pool.query(
        'INSERT INTO categories (name, parent_id) VALUES ($1, $2) RETURNING *',
        [name, parent_id || null]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error adding category:', err);
      throw new Error('An error occurred while adding the category.');
    }
  },
};

module.exports = CategoryModel;