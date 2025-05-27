const ProductModel = require('../models/productModel');
const ProductImageModel = require('../models/productImageModel');

const ProductController = {
  getAllProducts: async (req, res) => {
    // Configure multer middleware for file uploads here, outside of any controller function.
    // Example:
    // const storage = multer.diskStorage({...});
    // const upload = multer({ storage: storage });
    // This 'upload' variable would then be used in the routes file.

    try {
      const products = await ProductModel.getAllProducts();
      res.json(products);
    } catch (err) {
      console.error('Error in ProductController.getAllProducts:', err);
      res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
  },

  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await ProductModel.getProductById(id);
      if (product.length === 0) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      res.json(product[0]); // Assuming getProductById returns an array with one product
    } catch (err) {
      console.error('Error in ProductController.getProductById:', err);
      res.status(500).json({ error: 'An error occurred while fetching the product.' });
    }
  },

  createProduct: async (req, res) => {
    console.log('req.file:', req);
  
    const { name, description, price, sku, category_id, brand, weight, dimensions } = req.body;
    const imageFile = req.file; // Assuming multer middleware adds the file to req.file

    if (!imageFile) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const imagePath = imageFile.path; // Path where multer saved the image

    try {
      // Start a transaction if your database library supports it
      // await pool.query('BEGIN'); // Example for pg
      console.log('req.body:', req.body);
      console.log('req.file:', req.file);

      const { name, description, price, sku, category_id, brand, weight, dimensions } = req.body;

      console.log('name after destructuring:', name); // Add this line
      console.log('description after destructuring:', description); // Add this line
      // Add console logs for other variables as well

      const productResult = await ProductModel.createProduct(
        name,
        description,
        price,
        sku,
        category_id,
        brand,
        weight,
        dimensions
      );

      const newProductId = productResult.id; // Assuming createProduct returns the new product ID

      await ProductImageModel.createProductImage(
        newProductId,
        imagePath,
        name, // Using product name as alt_text
        0 // Default order_num
      );

      // Commit the transaction
      // await pool.query('COMMIT'); // Example for pg


      res.status(201).json({ message: 'Product added successfully!', productId: newProductId, imagePath: imagePath });
    } catch (err) {
      // Rollback the transaction in case of error
      // await pool.query('ROLLBACK'); // Example for pg

      console.error('Error in ProductController.createProduct:', err);
      res.status(500).json({ error: 'An error occurred while adding the product.', details: err.message });
    }
  },

  uploadProductImage: async (req, res) => {
    const uploadedFile = req.file; // This is the file object provided by multer

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    console.log('Request file:', req.file);
    console.log('Request body:', req.body);

    // TODO: Add logic here to save the file to a persistent storage (e.g., disk, S3)
    // TODO: Get the path or URL of the saved image
    // TODO: Call ProductImageModel.createProductImage to save image info to the database

    res.status(200).json({ message: 'File uploaded successfully!', file: uploadedFile });
  },
};
module.exports = ProductController;