import { NextResponse } from "next/server"
import Stripe from "stripe"

let stripe: Stripe;

const getStripe = async () => {
  if (!stripe) {
    const Stripe = (await import('stripe')).default;
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });
  }
  return stripe;
};

// Get webhook secret from environment variables
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const payload = await request.text()
  const sig = request.headers.get("stripe-signature") || ""

  let event: Stripe.Event

  try {
    event = (await getStripe()).webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`)
      // Here you would update your database to mark the order as paid
      break
    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`Payment failed: ${failedPaymentIntent.last_payment_error?.message || "Unknown error"}`)
      // Here you would update your database to mark the payment as failed
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true })
}
