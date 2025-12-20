const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Check for existing email or username first to provide clear errors
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email already in use' });
        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.status(400).json({ message: 'Username already in use' });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed, role });
        await user.save();
        return res.status(201).json({ message: 'User registered' });
    } catch (err) {
        console.error(err);
        // Handle duplicate key errors gracefully
        if (err && err.code === 11000) {
            const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
            return res.status(400).json({ message: `${field} already in use` });
        }
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
        return res.json({ token, user: { id: user._id, email: user.email, username: user.username, role: user.role } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
