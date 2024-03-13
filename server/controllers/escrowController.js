const EscrowAccount = require('../models/EscrowAccount');
const PaymentIntent = require('../models/PaymentIntent');
const { validateEscrowTransition } = require('../services/escrowManager');
const { dispatchEvent } = require('../services/webhookDispatcher');

// GET /api/escrow
const listEscrowAccounts = async (req, res, next) => {
  try {
    const accounts = await EscrowAccount.find({ merchantId: req.merchant.merchantId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: accounts.length,
      data: accounts
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/escrow/release/:id
const releaseEscrow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const escrow = await EscrowAccount.findOne({ escrowId: id, merchantId: req.merchant.merchantId });

    if (!escrow) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: `Escrow hold ${id} not found.`
      });
    }

    validateEscrowTransition(escrow.status, 'RELEASED');
    escrow.status = 'RELEASED';
    escrow.releaseDate = new Date();
    await escrow.save();

    // Release funds into available merchant balance
    req.merchant.escrowHoldCents = Math.max(0, req.merchant.escrowHoldCents - escrow.amountCents);
    req.merchant.balanceCents += escrow.amountCents;
    await req.merchant.save();

    // Update parent intent if present
    await PaymentIntent.findOneAndUpdate(
      { intentId: escrow.intentId },
      { status: 'SUCCEEDED' }
    );

    setImmediate(async () => {
      try {
        await dispatchEvent(
          req.merchant.merchantId,
          req.merchant.webhookUrl,
          'escrow.released',
          { escrowId: escrow.escrowId, amountCents: escrow.amountCents },
          req.merchant.webhookSecret
        );
      } catch (e) {
        console.error(e);
      }
    });

    res.json({
      success: true,
      message: 'Escrow hold released successfully to merchant balance.',
      data: escrow
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/escrow/dispute/:id
const disputeEscrow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = 'Buyer disputed service delivery' } = req.body;
    const escrow = await EscrowAccount.findOne({ escrowId: id, merchantId: req.merchant.merchantId });

    if (!escrow) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Escrow hold record not found.'
      });
    }

    validateEscrowTransition(escrow.status, 'DISPUTED');
    escrow.status = 'DISPUTED';
    escrow.disputeReason = reason;
    await escrow.save();

    res.json({
      success: true,
      message: 'Escrow placed in dispute freeze pending arbitration.',
      data: escrow
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listEscrowAccounts,
  releaseEscrow,
  disputeEscrow
};
