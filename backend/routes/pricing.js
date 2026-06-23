const express = require('express');
const router = express.Router();
const pricingService = require('../services/pricingService');

// POST /api/get-price
router.post('/get-price', async (req, res) => {
  try {
    const { productId, variantId, zipCode } = req.body;

    // Basic validation
    if (!zipCode) {
      return res.status(400).json({ success: false, error: 'ZIP code is required' });
    }

    if (!/^\d{5}$/.test(zipCode)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 5-digit ZIP code' });
    }

    // Process pricing via service
    const price = pricingService.getPriceByZip(zipCode);

    return res.status(200).json({
      success: true,
      zipCode,
      price,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Pricing Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error while fetching price' });
  }
});

module.exports = router;
