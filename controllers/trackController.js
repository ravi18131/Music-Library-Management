const Track = require("../models/Track");

// Retrieve All Tracks
const getTracks = async (req, res) => {
    const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;

    try {
        const query = {};
        if (artist_id) query.artist_id = artist_id;
        if (album_id) query.album_id = album_id;
        if (hidden !== undefined) query.hidden = hidden === "true";

        const tracks = await Track.find(query)
            .skip(Number(offset))
            .limit(Number(limit));

        return res.status(200).json({ success: true, data: tracks });
    } catch (error) {
        console.error("Get Tracks Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Retrieve a Single Track
const getTrackById = async (req, res) => {
    const { id } = req.params;

    try {
        const track = await Track.findById(id);
        if (!track)
            return res.status(404).json({ success: false, message: "Track not found." });

        return res.status(200).json({ success: true, data: track });
    } catch (error) {
        console.error("Get Track By ID Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Add a New Track
const addTrack = async (req, res) => {
    const { name, duration, hidden } = req.body;

    try {
        if (!name || !duration)
            return res
                .status(400)
                .json({ success: false, message: "Name and duration are required." });

        const newTrack = await Track.create({ name, duration, hidden });
        return res
            .status(201)
            .json({ success: true, message: "Track created successfully.", data: newTrack });
    } catch (error) {
        console.error("Add Track Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Update a Track
const updateTrack = async (req, res) => {
    const { id } = req.params;
    const { name, duration, hidden } = req.body;

    try {
        const track = await Track.findById(id);
        if (!track)
            return res.status(404).json({ success: false, message: "Track not found." });

        if (name !== undefined) track.name = name;
        if (duration !== undefined) track.duration = duration;
        if (hidden !== undefined) track.hidden = hidden;

        await track.save();
        return res.status(204).send(); // No Content
    } catch (error) {
        console.error("Update Track Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Delete a Track
const deleteTrack = async (req, res) => {
    const { id } = req.params;

    try {
        const track = await Track.findByIdAndDelete(id);
        if (!track)
            return res.status(404).json({ success: false, message: "Track not found." });

        return res
            .status(200)
            .json({ success: true, message: "Track deleted successfully." });
    } catch (error) {
        console.error("Delete Track Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

module.exports = {
    getTracks,
    getTrackById,
    addTrack,
    updateTrack,
    deleteTrack,
};
