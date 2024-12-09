const express = require("express");
const router = express.Router();
const {
    getFavoritesByCategory,
    addFavorite,
    removeFavorite,
} = require("../controllers/favoriteController");

const authMiddleware = require("../middleware/auth");

// Retrieve favorites by category (artist, album, track)
router.get("/:category", authMiddleware(["Admin", "Editor", "Viewer"]), getFavoritesByCategory);

// Add a new favorite
router.post("/add-favorite", authMiddleware(["Admin", "Editor", "Viewer"]), addFavorite);

// Remove a favorite by its favorite_id
router.delete("/remove-favorite/:id", authMiddleware(["Admin", "Editor", "Viewer"]), removeFavorite);

module.exports = router;
