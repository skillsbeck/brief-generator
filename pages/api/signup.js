export const dynamic = 'force-dynamic';

const stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;

  try {
    const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Create or get Stripe customer
    const customers = await stripeClient.customers.list({ email, limit: 1 });
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripeClient.customers.create({ email });
    }

    // Save to Supabase
    await supabase.from('clients').upsert({
      email,
      stripe_customer_id: customer.id,
      plan: 'saas_monthly',
      active: false
    });

    // Create Stripe checkout session
    const session = await stripeClient.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard?success=true`,
      cancel_url: `${req.headers.origin}/signup`,
    });

res.setHeader('Set-Cookie', `user_email=${email}; Path=/; HttpOnly; SameSite=Lax`);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}