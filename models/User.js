const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Editor', 'Viewer'], required: false, default: 'Viewer' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
