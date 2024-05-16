import React, { useState } from 'react';

export default function ApiKeysCard({ merchant }) {
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    if (merchant?.apiKey) {
      navigator.clipboard.writeText(merchant.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card">
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Developer API Authentication</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
        Authenticate server-to-server HTTP API calls using the <code>X-API-Key</code> header.
      </p>

      <div className="form-group">
        <label className="form-label">Merchant ID</label>
        <input
          type="text"
          readOnly
          className="form-input mono"
          value={merchant?.merchantId || 'merch_enterprise_991'}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Production API Secret Key</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            readOnly
            className="form-input mono"
            value={merchant?.apiKey || 'nx_live_c108a782b6e1b7f039d91fa9a5e8841b'}
          />
          <button className="btn-primary btn-sm" onClick={copyKey}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Webhook Signing Secret (HMAC-SHA256)</label>
        <input
          type="text"
          readOnly
          className="form-input mono"
          value="whsec_prod_9918204859a1bc"
        />
      </div>
    </div>
  );
}
