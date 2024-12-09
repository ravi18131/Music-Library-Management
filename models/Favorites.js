const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        category: { type: String, enum: ["artist", "album", "track"], required: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    },
    { timestamps: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);
