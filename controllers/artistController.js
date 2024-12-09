const Artist = require("../models/Artist");

// Retrieve all artists
const getArtists = async (req, res) => {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;

    try {
        const query = {};
        if (grammy !== undefined) query.grammy = grammy === "true"; // Convert to Boolean
        if (hidden !== undefined) query.hidden = hidden === "true"; // Convert to Boolean

        const artists = await Artist.find(query)
            .limit(parseInt(limit))
            .skip(parseInt(offset));
        return res.status(200).json({ success: true, data: artists });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Bad Request" });
    }
};

// Retrieve a single artist by ID
const getArtistById = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) return res.status(404).json({ success: false, message: "Artist not found" });
        return res.status(200).json({ success: true, data: artist });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Bad Request" });
    }
};

// Add a new artist
const addArtist = async (req, res) => {
    const { name, grammy, hidden } = req.body;

    try {
        if (!name) return res.status(400).json({ success: false, message: "Name is required" });

        const newArtist = await Artist.create({
            name,
            grammy: grammy !== undefined ? grammy : false,
            hidden: hidden !== undefined ? hidden : false,
        });

        return res.status(201).json({ success: true, data: newArtist });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Bad Request" });
    }
};

// Update an artist by ID
const updateArtist = async (req, res) => {
    const { name, grammy, hidden } = req.body;

    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) return res.status(404).json({ success: false, message: "Artist not found" });

        if (name !== undefined) artist.name = name;
        if (grammy !== undefined) artist.grammy = grammy;
        if (hidden !== undefined) artist.hidden = hidden;

        await artist.save();
        return res.status(204).json({
            success: true, message: "Artist updated successfully", data: artist
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Bad Request" });
    }
};

// Delete an artist by ID
const deleteArtist = async (req, res) => {
    try {
        const artist = await Artist.findByIdAndDelete(req.params.id);
        if (!artist) return res.status(404).json({ success: false, message: "Artist not found" });

        return res.status(200).json({ success: true, message: "Artist deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: "Bad Request" });
    }
};

module.exports = {
    getArtists,
    getArtistById,
    addArtist,
    updateArtist,
    deleteArtist,
};