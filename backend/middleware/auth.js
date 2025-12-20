const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'No token provided' });

    const parts = header.split(' ');
    if (parts.length !== 2) return res.status(401).json({ message: 'Token error' });

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Token malformatted' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalid' });
    }
}

function adminOnly(req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    next();
}

module.exports = { authMiddleware, adminOnly };
