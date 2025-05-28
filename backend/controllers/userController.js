const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = {
  signup: async (req, res) => {
    console.log(req.body)
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    try {
      // Check if user already exists
      const existingUser = await UserModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'User with this email already exists.'
        });
      }

      // Hash the password
      const saltRounds = 10; // Recommended salt rounds for bcrypt
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Insert the new user into the database
      await UserModel.createUser(email, password_hash);
      res.status(201).json({
        message: 'User registered successfully.'
      });
    } catch (err) {
      console.error('Error during signup:', err);
      res.status(500).json({
        error: 'An error occurred during signup.'
      });
    }
  },

  login: async (req, res) => {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    try {
      // Find the user by email
      const user = await UserModel.findUserByEmail(email);

      if (!user) {
        return res.status(401).json({
          error: 'Invalid email or password.'
        });
      }

      // Compare the provided password with the stored hash
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({
          error: 'Invalid email or password.'
        });
      }

      // Passwords match, create a JWT
      const jwtSecret = process.env.JWT_SECRET || 'YOUR_DEFAULT_SECRET'; // Use environment variable or a default
      const token = jwt.sign({
        id: user.id,
        email: user.email
      }, jwtSecret, {
        expiresIn: '1d'
      }); // Token expires in 1 day

      // Set the JWT in an HttpOnly, Secure, and SameSite cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' && process.env.HTTPS === 'true', // Set to true only in production with HTTPS
        sameSite: 'Lax', // Or 'Strict' depending on your needs
      });
      res.status(200).json({
        message: 'Login successful.'
      });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({
        error: 'An error occurred during login.'
      });
    }
  },
};

module.exports = UserController;