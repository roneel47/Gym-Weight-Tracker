const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getSettings, updateSettings, resetSettings } = require('../controllers/settingsController');

// All routes require authentication
router.use(authenticate);

// Get user settings
router.get('/', getSettings);

// Update user settings
router.put('/', updateSettings);

// Reset settings to defaults
router.post('/reset', resetSettings);

module.exports = router;
