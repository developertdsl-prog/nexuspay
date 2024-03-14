const express = require('express');
const router = express.Router();
const authApiKey = require('../middleware/authApiKey');
const { listEscrowAccounts, releaseEscrow, disputeEscrow } = require('../controllers/escrowController');

router.use(authApiKey);
router.get('/', listEscrowAccounts);
router.post('/release/:id', releaseEscrow);
router.post('/dispute/:id', disputeEscrow);

module.exports = router;
