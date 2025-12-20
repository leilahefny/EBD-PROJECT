const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const gam3yaController = require('../controllers/gam3yaController');

// POST /api/gam3yas (any authenticated user)
router.post('/', authMiddleware, gam3yaController.createGam3ya);

// GET /api/gam3yas
router.get('/', authMiddleware, gam3yaController.listGam3yas);

// GET /api/gam3yas/dashboard
router.get('/dashboard', authMiddleware, gam3yaController.dashboard);

// GET /api/gam3yas/:id
router.get('/:id', authMiddleware, gam3yaController.getGam3ya);

// GET /api/gam3yas/:id/schedule
router.get('/:id/schedule', authMiddleware, gam3yaController.schedule);

// POST /api/gam3yas/:id/join
router.post('/:id/join', authMiddleware, gam3yaController.joinGam3ya);

// POST /api/gam3yas/:id/generate-order
router.post('/:id/generate-order', authMiddleware, adminOnly, gam3yaController.generatePayoutOrder);

module.exports = router;
