const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Logout Controller
const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ success: true, message: "User logged out successfully." });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Sign Up Controller
const signUp = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({ success: false, message: "Email already exists." });

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashPassword, role });

        return res
            .status(201)
            .json({ success: true, message: "User created successfully.", user: newUser });
    } catch (error) {
        console.error("Sign Up Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Invalid credentials." });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res
            .status(200)
            .json({ success: true, message: "User logged in successfully.", token });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Get Users Controller
const getUsers = async (req, res) => {
    const { limit = 5, offset = 0, role } = req.query;

    try {
        const query = role ? { role } : {};
        const users = await User.find(query)
            .skip(Number(offset))
            .limit(Number(limit));

        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Get Users Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Add User Controller
const addUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        if (!email || !password)
            return res.status(400).json({ success: false, message: "All fields are required." });

        if (role === "Admin")
            return res.status(403).json({ success: false, message: "Cannot assign 'Admin' role." });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({ success: false, message: "Email already exists." });

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashPassword, role });

        return res
            .status(201)
            .json({ success: true, message: "User created successfully.", data: newUser });
    } catch (error) {
        console.error("Add User Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Delete User Controller
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user)
            return res.status(404).json({ success: false, message: "User not found." });

        return res
            .status(200)
            .json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        console.error("Delete User Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

// Update Password Controller
const updatePassword = async (req, res) => {
    const { old_password, new_password } = req.body;

    try {
        console.log("Req.user : ", req.user)
        const user = await User.findById(req.user.id);
        if (!user)
            return res.status(404).json({ success: false, message: "User not found." });

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch)
            return res
                .status(403)
                .json({ success: false, message: "Invalid old password." });

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();

        return res.status(204).send(); // No Content
    } catch (error) {
        console.error("Update Password Error:", error);
        return res.status(400).json({ success: false, message: "Bad Request." });
    }
};

module.exports = {
    logout,
    signUp,
    login,
    getUsers,
    addUser,
    deleteUser,
    updatePassword,
};