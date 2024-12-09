const Favorite = require("../models/Favorites");

// Retrieve Favorites based on category
const getFavoritesByCategory = async (req, res) => {
    const { category } = req.params;
    const { limit = 5, offset = 0 } = req.query;

    if (!["artist", "album", "track"].includes(category))
        return res.status(400).json({ success: false, message: "Invalid category." });

    try {
        const favorites = await Favorite.find({ category, user_id: req.user.id }) // Assuming the user is authenticated
            .skip(Number(offset))
            .limit(Number(limit));

        if (favorites.length === 0)
            return res.status(404).json({ success: false, message: "No favorites found." });

        return res.status(200).json({ success: true, data: favorites });
    } catch (error) {
        console.error("Get Favorites Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Add a Favorite
const addFavorite = async (req, res) => {
    const { category, user_id } = req.body;

    if (!category || !user_id)
        return res.status(400).json({ success: false, message: "Missing required fields." });

    if (!["artist", "album", "track"].includes(category))
        return res.status(400).json({ success: false, message: "Invalid category." });

    try {
        const newFavorite = await Favorite.create({ category, user_id });
        return res.status(201).json({
            success: true,
            message: "Favorite added successfully.",
            data: newFavorite,
        });
    } catch (error) {
        console.error("Add Favorite Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Remove a Favorite
const removeFavorite = async (req, res) => {
    const { id } = req.params;

    try {
        const favorite = await Favorite.findByIdAndDelete(id);
        if (!favorite)
            return res.status(404).json({ success: false, message: "Favorite not found." });

        return res.status(200).json({ success: true, message: "Favorite removed successfully." });
    } catch (error) {
        console.error("Remove Favorite Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

module.exports = {
    getFavoritesByCategory,
    addFavorite,
    removeFavorite,
};
