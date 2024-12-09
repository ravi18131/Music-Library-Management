const jwt = require("jsonwebtoken");
const userModel = require("../models/User.js");

const authMiddleware = (allowedRoles) => async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token is present in the Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided in the Authorization header.");
    return res.status(401).json({
      success: false,
      message: "Not Authorized, Please Login Again.",
    });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);

    // Instead of req.body.userId, set req.user
    req.user = { id: decodedToken.id };  // Now req.user will have the id

    // Fetch the user from the database
    const user = await userModel.findById(decodedToken.id);

    // If user does not exist, respond with 401 Unauthorized
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, User Not Found.",
      });
    }

    // Ensure the user has a valid organization and only one admin per organization
    if (user.organization && user.role === "admin") {
      const orgAdmins = await userModel.find({ organization: user.organization, role: "admin" });

      // Check if there is more than one admin in the organization
      if (orgAdmins.length > 1) {
        console.log("More than one admin found for the organization.");
        return res.status(403).json({
          success: false,
          message: "Only one admin is allowed per organization.",
        });
      }
    }

    // **Admin Route Check**: If the request path starts with /admin, ensure the user is an admin
    if (req.path.startsWith("/admin") && user.role !== "admin") {
      console.log("Access denied: User is not an admin.");
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admins Only.",
      });
    }

    // **Role Check**: Ensure the user has one of the allowed roles
    if (!allowedRoles.includes(user.role)) {
      console.log("Access denied: Role not permitted.");
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient Permissions.",
      });
    }

    // User is authenticated and authorized, proceed to next middleware
    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error);

    // Handle JWT-specific errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired, please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token, please log in again.",
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "Internal server error in auth middleware.",
    });
  }
};

module.exports = authMiddleware;