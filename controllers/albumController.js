const Album = require("../models/Album");

// Retrieve all albums
const getAlbums = async (req, res) => {
    const { limit = 5, offset = 0, hidden } = req.query;

    try {
        const query = {};
        if (hidden !== undefined) query.hidden = hidden;

        const albums = await Album.find(query)
            .limit(parseInt(limit))
            .skip(parseInt(offset));
        return res.status(200).json({ success: true, data: albums });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Bad Request" });
    }
};

// Retrieve a single album by ID
const getAlbumById = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ success: false, message: "Album not found" });
        return res.status(200).json({ success: true, data: album });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Bad Request" });
    }
};

// Add a new album
const addAlbum = async (req, res) => {
    const { name, year, hidden } = req.body;

    try {
        if (!name || !year) {
            return res.status(400).json({ success: false, message: "Name and Year are required" });
        }

        const newAlbum = await Album.create({ name, year, hidden });
        return res.status(201).json({ success: true, data: newAlbum });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Bad Request" });
    }
};

// Update an album by ID
const updateAlbum = async (req, res) => {
    const { name, year, hidden } = req.body;

    try {
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ success: false, message: "Album not found" });

        if (name !== undefined) album.name = name;
        if (year !== undefined) album.year = year;
        if (hidden !== undefined) album.hidden = hidden;

        await album.save();
        return res.status(204).send(); // No Content
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Bad Request" });
    }
};

// Delete an album by ID
const deleteAlbum = async (req, res) => {
    try {
        const album = await Album.findByIdAndDelete(req.params.id);
        if (!album) return res.status(404).json({ success: false, message: "Album not found" });

        return res.status(200).json({ success: true, message: "Album deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Bad Request" });
    }
};

module.exports = {
    getAlbums,
    getAlbumById,
    addAlbum,
    updateAlbum,
    deleteAlbum,
};