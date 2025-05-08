const jwt = require("jsonwebtoken");
const Users = require("../models/Users"); // Import the Users model
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to verify if the user is an admin
const verifyAdmin = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract the token from the Authorization header
  if (!token) return res.status(401).json({ message: "Token not provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify the token

    // Fetch the user from the database to ensure they exist and check their role
    const user = await Users.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = { verifyAdmin };
