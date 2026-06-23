# Shopify ZIP Code Based Pricing App

## Project Overview

The Shopify ZIP Code Based Pricing App solves the business problem of offering variable pricing based on geographic regions. By entering their ZIP code on the product page, customers receive dynamic price estimates specific to their location without navigating away. 

This repository acts as a monorepo containing both the storefront widget (a Shopify Theme App Extension) and the backend API (a Node.js/Express server) that manages the pricing rules.

## Architecture Diagram

```
Storefront
   ↓ (Customer enters ZIP, clicks Check Price)
Shopify Extension (Theme App Extension block)
   ↓ (Async fetch POST /api/get-price)
Backend API (Node.js + Express)
   ↓ (Calls Pricing Service)
Pricing Rules Engine (Hardcoded ZIP mapping)
   ↓
Response (Estimated price formatted and displayed)
```

## Repository Structure
```text
zip-pricing-manager/
├── backend/                  # Node.js + Express API
│   ├── package.json
│   ├── server.js
│   ├── routes/pricing.js
│   └── services/pricingService.js
│
├── extensions/               # Shopify Theme App Extension
│   └── zip-pricing-widget/
│       ├── assets/
│       │   ├── zip-pricing.css
│       │   └── zip-pricing.js
│       ├── blocks/
│       │   └── zip-pricing.liquid
│       └── shopify.extension.toml
│
└── shopify.app.toml          # Shopify CLI configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Shopify CLI installed globally (`npm install -g @shopify/cli`)
- A Shopify Partner account and a Development Store

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:3000`):
   ```bash
   npm start
   ```

### Frontend Setup (Shopify Extension)

1. From the root of this repository, start the Shopify App development server:
   ```bash
   shopify app dev
   ```
2. Follow the CLI prompts to connect to your Development Store.
3. In your Development Store Admin, navigate to **Online Store > Themes > Customize**.
4. Go to the **Default Product** template.
5. Click **Add block** and select **ZIP Code Pricing** from the list of Apps.
6. Drag the block near the Product Price. Ensure the `API URL` block setting matches your running backend URL (e.g., `http://localhost:3000/api/get-price`).
7. Click **Save**.

## Testing Instructions

Once the app is set up and the block is visible on your product page, use the input to test the hardcoded rules:

| Enter ZIP Code | Expected Result |
| -------------- | --------------- |
| `75028`        | $1,499.00       |
| `10001`        | $1,699.00       |
| `90210`        | $1,799.00       |
| `12345`        | $1,399.00 (Default)|

### Error Handling Tests:
- **Empty submission:** Expect "ZIP code is required".
- **Invalid format (e.g. `1234` or `abcd`):** Expect "Please enter a valid 5-digit ZIP code".
- **Backend stopped:** Stop the Express server and try checking a price; expect a friendly network error message.
