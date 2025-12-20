const express = require('express')
const router = express.Router()
const { authMiddleware, adminOnly } = require('../middleware/auth')
const ctrl = require('../controllers/notificationsController')

// user notifications
router.get('/', authMiddleware, ctrl.getNotificationsForUser)

// admin/system can create notifications
router.post('/', authMiddleware, adminOnly, ctrl.createNotification)

module.exports = router
