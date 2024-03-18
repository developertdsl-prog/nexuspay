const PaymentIntent = require('../models/PaymentIntent');

// GET /api/analytics/summary
const getAnalyticsSummary = async (req, res, next) => {
  try {
    const merchantId = req.merchant.merchantId;

    const [totals, railAgg, countTotal] = await Promise.all([
      PaymentIntent.aggregate([
        { $match: { merchantId, status: { $in: ['SUCCEEDED', 'IN_ESCROW'] } } },
        {
          $group: {
            _id: null,
            totalGrossCents: { $sum: '$amountCents' },
            totalFeeCents: { $sum: '$feeCents' },
            totalNetCents: { $sum: '$netAmountCents' },
            count: { $sum: 1 }
          }
        }
      ]),
      PaymentIntent.aggregate([
        { $match: { merchantId } },
        {
          $group: {
            _id: '$rail',
            count: { $sum: 1 },
            volumeCents: { $sum: '$amountCents' }
          }
        }
      ]),
      PaymentIntent.countDocuments({ merchantId })
    ]);

    const metrics = totals[0] || { totalGrossCents: 0, totalFeeCents: 0, totalNetCents: 0, count: 0 };
    const successRate = countTotal > 0 ? ((metrics.count / countTotal) * 100).toFixed(1) : '100.0';

    res.json({
      success: true,
      data: {
        totalGrossVolumeUSD: (metrics.totalGrossCents / 100).toFixed(2),
        totalFeesUSD: (metrics.totalFeeCents / 100).toFixed(2),
        totalNetVolumeUSD: (metrics.totalNetCents / 100).toFixed(2),
        settledTransactions: metrics.count,
        totalIntentsCreated: countTotal,
        successRatePercent: successRate,
        railBreakdown: railAgg.map(r => ({
          rail: r._id,
          count: r.count,
          volumeUSD: (r.volumeCents / 100).toFixed(2)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalyticsSummary };
