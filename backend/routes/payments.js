const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const paymentsController = require('../controllers/paymentsController');

// POST /api/payments/mark-paid
router.post('/mark-paid', authMiddleware, paymentsController.markPaid);

// GET /api/payments/:gam3yaId/:userId
router.get('/:gam3yaId/:userId', authMiddleware, paymentsController.getPaymentsForUser);

module.exports = router;
