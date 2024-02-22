const mongoose = require('mongoose');
const Merchant = require('../models/Merchant');
const PaymentIntent = require('../models/PaymentIntent');
const Transaction = require('../models/Transaction');
const EscrowAccount = require('../models/EscrowAccount');
const WebhookDelivery = require('../models/WebhookDelivery');

const seedNexusPay = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/nexuspay_db';
  await mongoose.connect(uri);
  console.log('[Seed] Connected to MongoDB...');

  await Promise.all([
    Merchant.deleteMany({}),
    PaymentIntent.deleteMany({}),
    Transaction.deleteMany({}),
    EscrowAccount.deleteMany({}),
    WebhookDelivery.deleteMany({})
  ]);

  const merchant = await Merchant.create({
    merchantId: 'merch_enterprise_991',
    businessName: 'Vertex Global Logistics Corp',
    contactEmail: 'treasury@vertexlogistics.io',
    apiKey: 'nx_live_c108a782b6e1b7f039d91fa9a5e8841b',
    webhookUrl: 'https://webhook.site/nexuspay-demo',
    webhookSecret: 'whsec_prod_9918204859a1bc',
    tier: 'ENTERPRISE',
    balanceCents: 4589000, // $45,890.00
    escrowHoldCents: 1250000 // $12,500.00
  });

  const intents = await PaymentIntent.create([
    {
      intentId: 'pi_demo_ach_001',
      merchantId: merchant.merchantId,
      amountCents: 1500000, // $15,000.00
      currency: 'USD',
      rail: 'ACH',
      customer: { name: 'Acme Heavy Industrial', email: 'ap@acmeind.com' },
      status: 'SUCCEEDED',
      feeCents: 11000,
      netAmountCents: 1489000,
      requiresEscrow: false,
      description: 'Monthly freight logistics invoice #FL-992'
    },
    {
      intentId: 'pi_demo_wire_002',
      merchantId: merchant.merchantId,
      amountCents: 5000000, // $50,000.00
      currency: 'USD',
      rail: 'FEDWIRE',
      customer: { name: 'Pacific Trade Alliance Ltd', email: 'settlements@pacifictrade.org' },
      status: 'IN_ESCROW',
      feeCents: 7500,
      netAmountCents: 4992500,
      requiresEscrow: true,
      description: 'Escrow hold for maritime container charter'
    },
    {
      intentId: 'pi_demo_sepa_003',
      merchantId: merchant.merchantId,
      amountCents: 850000, // €8,500.00
      currency: 'EUR',
      rail: 'SEPA_CREDIT',
      customer: { name: 'Rotterdam Terminal GmbH', email: 'invoices@rotterdam-terminal.de' },
      status: 'SUCCEEDED',
      feeCents: 4600,
      netAmountCents: 845400,
      requiresEscrow: false,
      description: 'Customs clearance fee cross-border SEPA'
    }
  ]);

  console.log(`[Seed Complete] Inserted 1 Merchant and ${intents.length} sample Payment Intents.`);
  await mongoose.disconnect();
};

if (require.main === module) {
  seedNexusPay().catch(console.error);
}

module.exports = seedNexusPay;
