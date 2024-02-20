const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const rateLimiter = require('./middleware/rateLimiter');
const auditLogger = require('./middleware/auditLogger');
const errorHandler = require('./middleware/errorHandler');

const merchantRoutes = require('./routes/merchantRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(rateLimiter({ windowMs: 60000, max: 200 }));
app.use(auditLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'NexusPay B2B Payment Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount modular API routing pipelines
app.use('/api/merchants', merchantRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[NexusPay] Gateway core listening on port ${PORT}`);
    });
  });
}

module.exports = app;
