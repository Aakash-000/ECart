import { NextResponse } from "next/server"
// We will dynamically import Stripe later
// import Stripe from "stripe"

let stripe: any; // Use 'any' type for now to avoid strict type issues with dynamic import

const getStripe = async () => {
  if (!stripe) {
    const Stripe = (await import('stripe')).default;
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16", // Use your desired API version
    });
  }
  return stripe;
};

interface RequestBody {
  amount: number
  payment_method_id?: string
}

export async function POST(request: Request) {
  try {
    const stripe = await getStripe();
    const { amount, payment_method_id }: RequestBody = await request.json()

    // Create a PaymentIntent with the order amount and currency
    let paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: "usd",
    }

    // If payment_method_id is provided, use it with confirmation_method
    // Otherwise, use automatic_payment_methods
    if (payment_method_id) {
      paymentIntentParams = {
        ...paymentIntentParams,
        payment_method: payment_method_id,
        confirmation_method: "manual",
        confirm: false,
      }
    } else {
      paymentIntentParams = {
        ...paymentIntentParams,
        automatic_payment_methods: {
          enabled: true,
        },
      }
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: error.message || "Error creating payment intent" }, { status: 500 })
  }
}
