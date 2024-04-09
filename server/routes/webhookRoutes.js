const express = require('express');
const router = express.Router();
const authApiKey = require('../middleware/authApiKey');
const { listDeliveries, sendTestPing } = require('../controllers/webhookController');

router.use(authApiKey);
router.get('/deliveries', listDeliveries);
router.post('/test-ping', sendTestPing);

module.exports = router;
