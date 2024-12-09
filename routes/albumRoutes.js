const express = require("express");
const {
    getAlbums,
    getAlbumById,
    addAlbum,
    updateAlbum,
    deleteAlbum,
} = require("../controllers/albumController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Routes
router.get("/", authMiddleware(["Admin", "Editor", "Viewer"]), getAlbums); // Retrieve all albums
router.get("/:id", authMiddleware(["Admin", "Editor", "Viewer"]), getAlbumById); // Retrieve an album by ID
router.post("/add-album", authMiddleware(["Admin"]), addAlbum); // Add a new album
router.put("/:id", authMiddleware(["Admin"]), updateAlbum); // Update an album by ID
router.delete("/:id", authMiddleware(["Admin"]), deleteAlbum); // Delete an album by ID

module.exports = router;
