const express = require("express");
const {
    logout,
    signUp,
    login,
    getUsers,
    addUser,
    deleteUser,
    updatePassword
} = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Logout
router.get("/logout", authMiddleware(["Admin", "Editor", "Viewer"]), logout);

// Sign Up
router.post("/signup", signUp);

// Login
router.post("/login", login);

// Retrieve All Users (Admin only)
router.get("/users", authMiddleware(["Admin"]), getUsers);

// Add New User (Admin only)
router.post("/users/add-user", authMiddleware(["Admin"]), addUser);

// Delete User (Admin only)
router.delete("/users/:id", authMiddleware(["Admin"]), deleteUser);

// Update Password (Any authenticated user)
router.put("/users/update-password", authMiddleware(["Admin", "Editor", "Viewer"]), updatePassword);

module.exports = router;
