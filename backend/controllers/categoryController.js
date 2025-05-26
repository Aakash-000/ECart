const CategoryModel = require('../models/categoryModel');

const CategoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await CategoryModel.getAllCategories();
      res.json(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'An error occurred while fetching categories.' });
    }
  },

  createCategory: async (req, res) => {
    const { name, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    try {
      const newCategory = await CategoryModel.createCategory(name, parent_id);
      res.status(201).json(newCategory);
    } catch (err) {
      console.error('Error adding category:', err);
      res.status(500).json({ error: 'An error occurred while adding the category.' });
    }
  },
};

module.exports = CategoryController;