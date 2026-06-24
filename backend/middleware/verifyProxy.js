const crypto = require('crypto');

function verifyProxy(req, res, next) {
  const { signature, ...queryWithoutSignature } = req.query;

  if (!signature) {
    // Graceful fallback for local development where firewalls block tunnels
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Development mode: Bypassing Shopify signature check for local testing.');
      return next();
    }

    console.warn('Unauthorized App Proxy request - missing signature.');
    return res.status(401).json({ error: 'Missing signature' });
  }

  // Sort query parameters alphabetically
  const sortedKeys = Object.keys(queryWithoutSignature).sort();
  
  // Concatenate keys and values
  const inputString = sortedKeys
    .map(key => `${key}=${queryWithoutSignature[key]}`)
    .join('');

  const secret = process.env.SHOPIFY_API_SECRET;
  
  if (!secret) {
    console.error('SHOPIFY_API_SECRET is missing in backend/.env');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  // Calculate HMAC-SHA256
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(inputString)
    .digest('hex');

  // Securely compare the calculated HMAC with the provided signature
  if (hmac.length === signature.length && crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))) {
    // Valid request, proceed to the route handler
    next();
  } else {
    console.warn('Unauthorized App Proxy request - signature mismatch.');
    res.status(401).json({ error: 'Unauthorized request' });
  }
}

module.exports = verifyProxy;
