const Stripe = require('stripe');
const Payment = require('../models/paymentModel');
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount, orderId } = req.body;
// app.post('/create-payment-intent', async (req, res) => {
//   const { amount, orderId } = req.body;

  // try {
  //   const paymentIntent = await stripe.paymentIntents.create({
  //     amount,
  //     currency: 'usd',
  //     metadata: { orderId }
  //   });

  //   const payment = new Payment({
  //     orderId,
  //     stripePaymentIntentId: paymentIntent.id,
  //     amount,
  //     status: 'created'
  //   });

  //   await payment.save();

  //   res.status(200).json({
  //     clientSecret: paymentIntent.client_secret,
  //     paymentId: payment._id,
  //     message: 'Payment completed successfully'
  //   });
  // } catch (error) {
  //   console.error('Stripe payment error:', error);
  //   res.status(500).json({ message: 'Payment failed', error: error.message });
  // }
  try {
    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Order Payment',
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    res.json({ sessionId: session.id });  // Send back the sessionId
  } catch (error) {
    res.status(500).send(error.message);
  }
};
module.exports = {
  createPaymentIntent,
};

