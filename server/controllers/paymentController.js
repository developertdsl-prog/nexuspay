const crypto = require('crypto');
const PaymentIntent = require('../models/PaymentIntent');
const Transaction = require('../models/Transaction');
const EscrowAccount = require('../models/EscrowAccount');
const Merchant = require('../models/Merchant');
const { calculateTransactionFee } = require('../services/feeCalculator');
const { validateStateTransition, executeRailClearing } = require('../services/paymentOrchestrator');
const { dispatchEvent } = require('../services/webhookDispatcher');

// POST /api/payments/intent
const createPaymentIntent = async (req, res, next) => {
  try {
    const { amountCents, currency = 'USD', rail, customer, requiresEscrow, description, metadata } = req.body;

    if (!amountCents || !rail || !customer || !customer.name || !customer.email) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'amountCents, rail, customer.name, and customer.email are required fields.'
      });
    }

    const merchant = req.merchant;
    const feeCalculation = calculateTransactionFee(amountCents, rail, merchant.tier);

    const intentId = `pi_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const idempotencyKey = req.header('Idempotency-Key') || null;

    const intent = await PaymentIntent.create({
      intentId,
      merchantId: merchant.merchantId,
      amountCents,
      currency,
      rail,
      customer,
      status: 'CREATED',
      feeCents: feeCalculation.totalFeeCents,
      netAmountCents: feeCalculation.netAmountCents,
      requiresEscrow: Boolean(requiresEscrow),
      description: description || 'B2B Rail Settlement',
      idempotencyKey,
      metadata
    });

    res.status(201).json({
      success: true,
      data: intent
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/payments/confirm/:id
const confirmPaymentIntent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const intent = await PaymentIntent.findOne({ intentId: id, merchantId: req.merchant.merchantId });

    if (!intent) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: `Payment intent ${id} not found.`
      });
    }

    validateStateTransition(intent.status, 'PROCESSING');
    intent.status = 'PROCESSING';
    await intent.save();

    // Execute rail clearing
    const clearingResult = await executeRailClearing(intent);

    const targetStatus = intent.requiresEscrow ? 'IN_ESCROW' : 'SUCCEEDED';
    validateStateTransition('PROCESSING', targetStatus);
    intent.status = targetStatus;
    await intent.save();

    // Create settled transaction ledger entry
    const transaction = await Transaction.create({
      transactionId: `txn_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      intentId: intent.intentId,
      merchantId: intent.merchantId,
      rail: intent.rail,
      railReference: clearingResult.railReference,
      amountCents: intent.amountCents,
      feeCents: intent.feeCents,
      netAmountCents: intent.netAmountCents,
      currency: intent.currency,
      settlementStatus: intent.requiresEscrow ? 'ESCROW_HELD' : 'SETTLED',
      settlementDate: clearingResult.clearedAt
    });

    // Update merchant balances
    if (intent.requiresEscrow) {
      await EscrowAccount.create({
        escrowId: `esc_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
        intentId: intent.intentId,
        merchantId: intent.merchantId,
        payerEmail: intent.customer.email,
        amountCents: intent.netAmountCents,
        status: 'HELD'
      });
      req.merchant.escrowHoldCents += intent.netAmountCents;
    } else {
      req.merchant.balanceCents += intent.netAmountCents;
    }
    await req.merchant.save();

    // Dispatch webhook asynchronously
    setImmediate(async () => {
      try {
        await dispatchEvent(
          req.merchant.merchantId,
          req.merchant.webhookUrl,
          intent.requiresEscrow ? 'escrow.held' : 'payment.succeeded',
          { intentId: intent.intentId, amountCents: intent.amountCents, status: intent.status },
          req.merchant.webhookSecret
        );
      } catch (err) {
        console.error('[Webhook Dispatch Error]', err.message);
      }
    });

    res.json({
      success: true,
      data: {
        intent,
        transaction
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/payments
const listPayments = async (req, res, next) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = { merchantId: req.merchant.merchantId };
    if (status) filter.status = status;

    const payments = await PaymentIntent.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/payments/:id
const getPaymentById = async (req, res, next) => {
  try {
    const intent = await PaymentIntent.findOne({
      intentId: req.params.id,
      merchantId: req.merchant.merchantId
    });

    if (!intent) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Payment intent not found.'
      });
    }

    res.json({
      success: true,
      data: intent
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
  listPayments,
  getPaymentById
};
