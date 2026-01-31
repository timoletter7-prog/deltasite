const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Tebex API configuration
const TEBEX_BASE_URL = 'https://headless.tebex.io/api';
const TEBEX_SECRET = process.env.TEBEX_SECRET;

// Supabase client for database operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create Tebex basket and return checkout URL
app.post('/api/create-checkout', async (req, res) => {
  try {
    const { amount, currency = 'EUR', returnUrl, cancelUrl, player, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Step 1: Create a basket
    const basketResponse = await axios.post(`${TEBEX_BASE_URL}/accounts/${process.env.TEBEX_ACCOUNT_ID}/baskets`, {
      return_url: returnUrl || `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`,
      complete_url: `${process.env.FRONTEND_URL}/payment/success`,
      custom: {
        // Include player data for webhook processing
        player: player,
        order_id: orderId || `order_${Date.now()}`,
        amount: amount
      }
    }, {
      headers: {
        'Authorization': `Bearer ${TEBEX_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    const basket = basketResponse.data.data;

    // Step 2: Add a package with custom amount
    const packageResponse = await axios.post(`${TEBEX_BASE_URL}/accounts/${process.env.TEBEX_ACCOUNT_ID}/baskets/${basket.id}/packages`, {
      package_id: process.env.TEBEX_PACKAGE_ID, // Your custom amount package ID
      quantity: 1,
      variables: {
        // For custom amount packages, you might need to set the price here
        // This depends on how you set up your Tebex package
        custom_price: amount
      }
    }, {
      headers: {
        'Authorization': `Bearer ${TEBEX_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    // Step 3: Get the checkout URL
    const checkoutResponse = await axios.get(`${TEBEX_BASE_URL}/accounts/${process.env.TEBEX_ACCOUNT_ID}/baskets/${basket.id}`, {
      headers: {
        'Authorization': `Bearer ${TEBEX_SECRET}`
      }
    });

    const checkoutUrl = checkoutResponse.data.data.links.checkout;

    res.json({
      success: true,
      checkoutUrl: checkoutUrl,
      basketId: basket.id
    });

  } catch (error) {
    console.error('Tebex API error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create checkout',
      details: error.response?.data || error.message
    });
  }
});

// Webhook endpoint for payment confirmations (optional but recommended)
app.post('/api/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-tebex-signature'];

    // Verify webhook signature for security
    if (!signature) {
      console.error('Missing webhook signature');
      return res.status(401).json({ error: 'Missing signature' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', TEBEX_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { type, subject } = req.body;

    console.log('Tebex webhook received:', { type, subject });

    // Handle different webhook types
    switch (type) {
      case 'payment.completed':
        console.log('Payment completed for basket:', subject.id);

        // Update purchases from 'tebex_pending' to 'completed'
        try {
          // Get basket details to find associated purchases
          const basketResponse = await axios.get(`${TEBEX_BASE_URL}/accounts/${process.env.TEBEX_ACCOUNT_ID}/baskets/${subject.id}`, {
            headers: {
              'Authorization': `Bearer ${TEBEX_SECRET}`
            }
          });

          const basket = basketResponse.data.data;
          const player = basket.custom?.player;

          if (player) {
            // Update both purchases and backup_purchases tables
            const { error: purchasesError } = await supabase
              .from('purchases')
              .update({
                payment: 'completed',
                executed: true
              })
              .eq('player', player)
              .eq('payment', 'tebex_pending');

            const { error: backupError } = await supabase
              .from('backup_purchases')
              .update({
                payment: 'completed',
                executed: true
              })
              .eq('player', player)
              .eq('payment', 'tebex_pending');

            if (purchasesError) {
              console.error('Error updating purchases table:', purchasesError);
            }
            if (backupError) {
              console.error('Error updating backup_purchases table:', backupError);
            }

            console.log(`Updated purchases for player ${player} to completed status`);
          } else {
            console.warn('No player data found in basket custom field');
          }
        } catch (dbError) {
          console.error('Database update error:', dbError);
        }
        break;

      case 'payment.declined':
        console.log('Payment declined for basket:', subject.id);
        // Optionally handle declined payments (mark as failed, notify user, etc.)
        break;

      default:
        console.log('Unhandled webhook type:', type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
