const pool = require('../config/db');

const UserModel = {
  /**
   * Creates a new user in the database.
   * @param {string} email The user's email.
   * @param {string} password_hash The hashed password.
   * @returns {Promise<object>} A promise that resolves with the created user's data.
   */
  async createUser(email, password_hash) {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, password_hash]
    );
    return result.rows[0];
  },

  /**
   * Finds a user in the database by email.
   * @param {string} email The user's email.
   * @returns {Promise<object | undefined>} A promise that resolves with the user's data or undefined if not found.
   */
  async findUserByEmail(email) {
    const result = await pool.query('SELECT id, email, password_hash, created_at FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }
};

module.exports = UserModel;