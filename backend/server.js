const express = require('express');
const cors = require('cors');
const pricingRoutes = require('./routes/pricing');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // In production, restrict to your Shopify store domain
app.use(express.json());

// Routes
app.use('/api', pricingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ZIP Code Pricing API is running.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
