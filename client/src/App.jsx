import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricCard from './components/MetricCard';
import PaymentRailsGrid from './components/PaymentRailsGrid';
import TransactionTable from './components/TransactionTable';
import CreatePaymentModal from './components/CreatePaymentModal';
import EscrowManagerView from './components/EscrowManagerView';
import WebhookMonitor from './components/WebhookMonitor';
import ApiKeysCard from './components/ApiKeysCard';
import { api } from './services/api';
import './styles/main.css';
import './styles/responsive.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [merchant, setMerchant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [payments, setPayments] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const [mRes, aRes, pRes, eRes, wRes] = await Promise.all([
      api.getMerchant(),
      api.getAnalytics(),
      api.getPayments(),
      api.getEscrows(),
      api.getWebhooks()
    ]);

    if (mRes.success) setMerchant(mRes.data);
    if (aRes.success) setAnalytics(aRes.data);
    if (pRes.success) setPayments(pRes.data);
    if (eRes.success) setEscrows(eRes.data);
    if (wRes.success) setWebhooks(wRes.data);
  };

  const handleCreateIntent = async (formData) => {
    const res = await api.createPayment(formData);
    if (res.success) {
      setPayments([res.data, ...payments]);
      loadAllData();
    }
  };

  const handleConfirmPayment = async (intentId) => {
    const res = await api.confirmPayment(intentId);
    if (res.success) {
      loadAllData();
    }
  };

  const handleReleaseEscrow = async (escrowId) => {
    const res = await api.releaseEscrow(escrowId);
    if (res.success) {
      loadAllData();
    }
  };

  const handleTestPing = async (url) => {
    const res = await api.sendTestPing(url);
    if (res.success && res.delivery) {
      setWebhooks([res.delivery, ...webhooks]);
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} merchant={merchant} />

      {activeTab === 'dashboard' && (
        <>
          <div className="stats-row">
            <MetricCard
              title="Gross Settled Volume"
              value={`$${analytics?.totalGrossVolumeUSD || '73,500.00'}`}
              trend="+14.2%"
              subtitle="vs last month"
              icon="💳"
            />
            <MetricCard
              title="Escrow In-Vault"
              value={`$${merchant ? (merchant.escrowHoldCents / 100).toFixed(2) : '12,500.00'}`}
              trend="3 Holds"
              subtitle="active arbitration"
              icon="🔒"
            />
            <MetricCard
              title="Settlement Rate"
              value={`${analytics?.successRatePercent || '98.5'}%`}
              trend="99.9% SLA"
              subtitle="multi-rail uptime"
              icon="⚡"
            />
            <MetricCard
              title="Net Gateway Fees"
              value={`$${analytics?.totalFeesUSD || '231.00'}`}
              trend="18 bps"
              subtitle="effective rate"
              icon="📊"
            />
          </div>

          <PaymentRailsGrid />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recent Transactions</h3>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              + Create Payment Intent
            </button>
          </div>

          <TransactionTable payments={payments} onConfirm={handleConfirmPayment} />
        </>
      )}

      {activeTab === 'payments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>All Payment Intents</h3>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              + Create Payment Intent
            </button>
          </div>
          <TransactionTable payments={payments} onConfirm={handleConfirmPayment} />
        </div>
      )}

      {activeTab === 'escrow' && (
        <EscrowManagerView escrows={escrows} onRelease={handleReleaseEscrow} />
      )}

      {activeTab === 'webhooks' && (
        <WebhookMonitor webhooks={webhooks} onTestPing={handleTestPing} />
      )}

      {activeTab === 'developer' && (
        <ApiKeysCard merchant={merchant} />
      )}

      <CreatePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateIntent}
      />
    </div>
  );
}
