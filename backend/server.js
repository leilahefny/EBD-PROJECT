const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true
}));

// Simple route
app.get('/', (req, res) => res.send('Gam3ali Shokran API'));

// Import routes (placeholders)
const authRoutes = require('./routes/auth');
const gam3yaRoutes = require('./routes/gam3yas');
const paymentsRoutes = require('./routes/payments');
const notificationsRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/gam3yas', gam3yaRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Start function: supports spinning up an in-memory MongoDB when USE_INMEM=true
async function start() {
    try {
        if (process.env.USE_INMEM === 'true') {
            // Lazy require to avoid bringing this in normal runs
            const { MongoMemoryServer } = require('mongodb-memory-server');
            console.log('Starting in-memory MongoDB...');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            process.env.MONGO_URI = uri;
            // Ensure we stop the server on exit
            const cleanup = async () => {
                try { await mongod.stop(); } catch (e) { }
                process.exit();
            };
            process.on('SIGINT', cleanup);
            process.on('SIGTERM', cleanup);
        }

        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/gam3ali';
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err.message || err);
    } finally {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    }
}

start();
