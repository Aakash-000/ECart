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
  
      if (!product || product.length === 0 || !product[0]) {
        return res.status(404).json({ error: 'Product not found.' });
      }
  
      // Define fields you want to exclude
      const unwantedFields = ['created_at', 'updated_at', 'deleted_at', '__v'];
  
      // Safe filtering
      const filteredProduct = Object.fromEntries(
        Object.entries(product[0]).filter(
          ([key, value]) =>
            !unwantedFields.includes(key) &&
            ['string', 'number', 'boolean'].includes(typeof value)
        )
      );
  
      res.json(filteredProduct);
  
    } catch (err) {
      console.error('Error in ProductController.getProductById:', err);
      res.status(500).json({ error: 'An error occurred while fetching the product.' });
    }
  },
  
  createProduct : async (req, res) => {
    try {
      console.log('req.body:', req.body);
      console.log('req.file:', req.file);
  
      const { name, description, price, sku, category_id, brand, weight, dimensions } = req.body;
  
      console.log('name after destructuring:', name);
      console.log('description after destructuring:', description);
      console.log('price after destructuring:', price);
      console.log('sku after destructuring:', sku);
      console.log('category_id after destructuring:', category_id);
      console.log('brand after destructuring:', brand);
      console.log('weight after destructuring:', weight);
      console.log('dimensions after destructuring:', dimensions);
  
  
      console.log('Before calling createProduct - name:', name); // Add this line
  
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
  
      console.log('After calling createProduct - productResult:', productResult); // Add this line
  
  
      const newProductId = productResult.id; // Assuming createProduct returns the new product ID
      const imagePath = `/uploads/images/${req.file.filename}`; // Relative path where multer saved the image
  
  
      console.log('Before calling createProductImage - newProductId:', newProductId); // Add this line
      console.log('Before calling createProductImage - imagePath:', imagePath); // Add this line
      console.log('Before calling createProductImage - name:', name); // Add this line
  
  
      await ProductImageModel.createProductImage(
        newProductId,
        imagePath,
        name, // Using product name as alt_text
        0 // Default order_num
      );
  
      console.log('After calling createProductImage'); // Add this line
  
  
      res.status(201).json({ message: 'Product added successfully!', productId: newProductId, imagePath: imagePath });
    } catch (err) {
      console.error('Error in ProductController.createProduct:', err);
      res.status(500).json({ error: 'An error occurred while adding the product.', details: err.message });
    }
  },
  

  uploadProductImage: async (req, res) => {
    try {
      const uploadedFile = req.file; // This is the file object provided by multer
      const { product_id } = req.body; // Get product_id from the request body

      if (!uploadedFile) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      // Construct the relative path starting from /uploads
      const relativeImagePath = `/uploads/images/${uploadedFile.filename}`;

      // Save image info to the database
      await ProductImageModel.createProductImage(
        product_id,
        relativeImagePath,
        uploadedFile.originalname, // Use original filename as alt text, or you can get it from req.body
        0 // Default order_num
      );

    res.status(200).json({ message: 'File uploaded successfully!', file: uploadedFile });
    } catch (error) {
      console.error('Error in ProductController.uploadProductImage:', error);
      res.status(500).json({ error: 'An error occurred while uploading the image.' });
    }
  }
};
module.exports = ProductController;