const express = require('express');
const router = express.Router();
const authApiKey = require('../middleware/authApiKey');
const { getCurrentMerchant, registerMerchant, regenerateApiKey } = require('../controllers/merchantController');

router.get('/me', authApiKey, getCurrentMerchant);
router.post('/register', registerMerchant);
router.post('/regenerate-key', authApiKey, regenerateApiKey);

module.exports = router;
