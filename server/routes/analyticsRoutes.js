const express = require('express');
const router = express.Router();
const authApiKey = require('../middleware/authApiKey');
const { getAnalyticsSummary } = require('../controllers/analyticsController');

router.use(authApiKey);
router.get('/summary', getAnalyticsSummary);

module.exports = router;
