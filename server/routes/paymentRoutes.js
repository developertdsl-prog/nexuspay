const express = require('express');
const router = express.Router();
const authApiKey = require('../middleware/authApiKey');
const idempotency = require('../middleware/idempotency');
const {
  createPaymentIntent,
  confirmPaymentIntent,
  listPayments,
  getPaymentById
} = require('../controllers/paymentController');

router.use(authApiKey);
router.post('/intent', idempotency, createPaymentIntent);
router.post('/confirm/:id', idempotency, confirmPaymentIntent);
router.get('/', listPayments);
router.get('/:id', getPaymentById);

module.exports = router;
