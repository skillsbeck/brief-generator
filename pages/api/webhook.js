import { buffer } from 'micro';
const stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'customer.subscription.created' ||
      event.type === 'invoice.payment_succeeded') {
    const customerId = event.data.object.customer;

    await supabase
      .from('clients')
      .update({ active: true })
      .eq('stripe_customer_id', customerId);
  }

  if (event.type === 'customer.subscription.deleted') {
    const customerId = event.data.object.customer;

    await supabase
      .from('clients')
      .update({ active: false })
      .eq('stripe_customer_id', customerId);
  }

  return res.status(200).json({ received: true });
}