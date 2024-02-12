const crypto = require('crypto');
const Merchant = require('../models/Merchant');

// GET /api/merchants/me
const getCurrentMerchant = async (req, res, next) => {
  try {
    const merchant = req.merchant;
    res.json({
      success: true,
      data: merchant
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/merchants/register
const registerMerchant = async (req, res, next) => {
  try {
    const { businessName, contactEmail, tier = 'STANDARD' } = req.body;
    if (!businessName || !contactEmail) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'businessName and contactEmail are required.'
      });
    }

    const merchantId = `merch_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const apiKey = `nx_live_${crypto.randomBytes(16).toString('hex')}`;
    const webhookSecret = `whsec_${crypto.randomBytes(20).toString('hex')}`;

    const merchant = await Merchant.create({
      merchantId,
      businessName,
      contactEmail,
      apiKey,
      webhookSecret,
      tier
    });

    res.status(201).json({
      success: true,
      data: merchant
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/merchants/regenerate-key
const regenerateApiKey = async (req, res, next) => {
  try {
    const newApiKey = `nx_live_${crypto.randomBytes(16).toString('hex')}`;
    req.merchant.apiKey = newApiKey;
    await req.merchant.save();

    res.json({
      success: true,
      message: 'API key regenerated successfully.',
      apiKey: newApiKey
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentMerchant,
  registerMerchant,
  regenerateApiKey
};
