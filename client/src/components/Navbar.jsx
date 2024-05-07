import React from 'react';

export default function Navbar({ activeTab, setActiveTab, merchant }) {
  const balance = merchant ? (merchant.balanceCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00';
  const escrowHold = merchant ? (merchant.escrowHoldCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00';

  return (
    <nav className="navbar-container">
      <div className="brand">
        <span className="brand-logo">NEXUSPAY</span>
        <span className="env-badge">LIVE API</span>
      </div>

      <div className="nav-links">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Overview
        </button>
        <button
          className={`nav-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Payments
        </button>
        <button
          className={`nav-btn ${activeTab === 'escrow' ? 'active' : ''}`}
          onClick={() => setActiveTab('escrow')}
        >
          Escrow Vault
        </button>
        <button
          className={`nav-btn ${activeTab === 'webhooks' ? 'active' : ''}`}
          onClick={() => setActiveTab('webhooks')}
        >
          Webhooks
        </button>
        <button
          className={`nav-btn ${activeTab === 'developer' ? 'active' : ''}`}
          onClick={() => setActiveTab('developer')}
        >
          Developer Keys
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div className="nav-balance-pill">
          <span>Settled:</span>
          <span className="balance-amount">${balance}</span>
        </div>
        <div className="nav-balance-pill" style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
          <span>Escrow:</span>
          <span style={{ color: '#f59e0b', fontWeight: 700 }}>${escrowHold}</span>
        </div>
      </div>
    </nav>
  );
}
