const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// Middleware to check if user is authenticated via session
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    // User is authenticated, proceed to the next middleware or route handler
    return next();
  }
 else {
    // User is not authenticated, return 401 Unauthorized
    return res.sendStatus(401); // If there's no token, return 401 Unauthorized
  }
}

// Middleware to verify JWT
function verifyJWT(req, res, next) {
  const token = req.cookies.token; // Get token from the 'token' cookie

  if (!token) {
    return res.sendStatus(401); // If there's no token, return 401 Unauthorized
  }

  const jwtSecret = process.env.JWT_SECRET || 'YOUR_DEFAULT_SECRET'; // Use environment variable or a default

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // If token is invalid, return 403 Forbidden
    }
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = {
    isAuthenticated,
    verifyJWT
};