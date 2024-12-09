const express = require("express");
const router = express.Router();
const {
    getTracks,
    getTrackById,
    addTrack,
    updateTrack,
    deleteTrack,
} = require("../controllers/trackController");
const authMiddleware = require("../middleware/auth");

// Retrieve all tracks
router.get("/", authMiddleware(["Admin", "Editor", "Viewer"]), getTracks);

// Retrieve a single track by ID
router.get("/:id", authMiddleware(["Admin", "Editor", "Viewer"]), getTrackById);

// Add a new track
router.post("/add-track", authMiddleware(["Admin"]), addTrack);

// Update a track by ID
router.put("/:id", authMiddleware(["Admin"]), updateTrack);

// Delete a track by ID
router.delete("/:id", authMiddleware(["Admin"]), deleteTrack);

module.exports = router;
