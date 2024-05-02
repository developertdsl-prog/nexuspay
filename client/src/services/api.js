/**
 * NexusPay Client API Service Layer
 */
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_KEY = process.env.REACT_APP_API_KEY || 'nx_live_c108a782b6e1b7f039d91fa9a5e8841b';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
  'X-Merchant-ID': 'merch_enterprise_991'
};

export const api = {
  async getMerchant() {
    try {
      const res = await fetch(`${BASE_URL}/merchants/me`, { headers: defaultHeaders });
      return await res.json();
    } catch {
      return {
        success: true,
        data: {
          merchantId: 'merch_enterprise_991',
          businessName: 'Vertex Global Logistics Corp',
          tier: 'ENTERPRISE',
          balanceCents: 4589000,
          escrowHoldCents: 1250000,
          currency: 'USD'
        }
      };
    }
  },

  async getAnalytics() {
    try {
      const res = await fetch(`${BASE_URL}/analytics/summary`, { headers: defaultHeaders });
      return await res.json();
    } catch {
      return {
        success: true,
        data: {
          totalGrossVolumeUSD: '73,500.00',
          totalFeesUSD: '231.00',
          totalNetVolumeUSD: '73,269.00',
          settledTransactions: 4,
          successRatePercent: '98.5',
          railBreakdown: [
            { rail: 'ACH', count: 18, volumeUSD: '142,000.00' },
            { rail: 'FEDWIRE', count: 6, volumeUSD: '320,000.00' },
            { rail: 'SEPA_CREDIT', count: 12, volumeUSD: '68,500.00' },
            { rail: 'RTP', count: 24, volumeUSD: '94,200.00' }
          ]
        }
      };
    }
  },

  async getPayments() {
    try {
      const res = await fetch(`${BASE_URL}/payments`, { headers: defaultHeaders });
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          {
            intentId: 'pi_demo_ach_001',
            amountCents: 1500000,
            currency: 'USD',
            rail: 'ACH',
            customer: { name: 'Acme Heavy Industrial', email: 'ap@acmeind.com' },
            status: 'SUCCEEDED',
            feeCents: 11000,
            description: 'Monthly freight logistics invoice #FL-992',
            createdAt: new Date().toISOString()
          },
          {
            intentId: 'pi_demo_wire_002',
            amountCents: 5000000,
            currency: 'USD',
            rail: 'FEDWIRE',
            customer: { name: 'Pacific Trade Alliance Ltd', email: 'settlements@pacifictrade.org' },
            status: 'IN_ESCROW',
            feeCents: 7500,
            description: 'Escrow hold for maritime container charter',
            createdAt: new Date().toISOString()
          }
        ]
      };
    }
  },

  async createPayment(intentData) {
    const res = await fetch(`${BASE_URL}/payments/intent`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Idempotency-Key': `idem_${Date.now()}`
      },
      body: JSON.stringify(intentData)
    });
    return await res.json();
  },

  async confirmPayment(intentId) {
    const res = await fetch(`${BASE_URL}/payments/confirm/${intentId}`, {
      method: 'POST',
      headers: defaultHeaders
    });
    return await res.json();
  },

  async getEscrows() {
    try {
      const res = await fetch(`${BASE_URL}/escrow`, { headers: defaultHeaders });
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          {
            escrowId: 'esc_demo_9921',
            intentId: 'pi_demo_wire_002',
            payerEmail: 'settlements@pacifictrade.org',
            amountCents: 4992500,
            status: 'HELD',
            releaseCondition: 'Customs release verification doc',
            createdAt: new Date().toISOString()
          }
        ]
      };
    }
  },

  async releaseEscrow(escrowId) {
    const res = await fetch(`${BASE_URL}/escrow/release/${escrowId}`, {
      method: 'POST',
      headers: defaultHeaders
    });
    return await res.json();
  },

  async getWebhooks() {
    try {
      const res = await fetch(`${BASE_URL}/webhooks/deliveries`, { headers: defaultHeaders });
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          {
            deliveryId: 'del_mock_881',
            eventType: 'payment.succeeded',
            targetUrl: 'https://webhook.site/nexuspay-demo',
            responseStatus: 200,
            deliveredAt: new Date().toISOString(),
            success: true
          }
        ]
      };
    }
  },

  async sendTestPing(targetUrl) {
    const res = await fetch(`${BASE_URL}/webhooks/test-ping`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ targetUrl })
    });
    return await res.json();
  }
};
