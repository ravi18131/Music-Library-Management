const express = require("express");
const { getArtists, getArtistById, addArtist, updateArtist, deleteArtist } = require("../controllers/artistController.js");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Routes
router.get("/", authMiddleware(["Admin", "Editor","Viewer"]), getArtists); // Retrieve all artists
router.get("/:id", authMiddleware(["Admin", "Editor", "Viewer"]), getArtistById); // Retrieve artist by ID
router.post("/add-artist", authMiddleware(["Admin"]), addArtist); // Add a new artist
router.put("/:id", authMiddleware(["Admin"]), updateArtist); // Update artist by ID
router.delete("/:id", authMiddleware(["Admin"]), deleteArtist); // Delete artist by ID

module.exports = router;
