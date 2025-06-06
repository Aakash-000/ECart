"use client"

import React, { useRef } from "react"
import { useState, useEffect } from "react"
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import type { StripeCardElementChangeEvent } from "@stripe/stripe-js"
import { useRouter } from "next/navigation"
import {useBillingStore} from "@/store/billingStore"

interface StripeCheckoutFormProps {
  amount: number
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function StripeCheckoutForm({ amount = 83400 }: StripeCheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<boolean>(false)
  const [succeeded, setSucceeded] = useState<boolean>(false)
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [clientSecret, setClientSecret] = useState<string>("")
  const[isLoading, setIsLoading] = useState<boolean>(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter();
  // Format amount for display
  const formattedAmount = (amount / 100).toFixed(2)
  // console.log(address1,address2,city,state,zipCode)
  // Create PaymentIntent as soon as the page loads
  // useEffect(() => {
  //   async function createPaymentIntent() {
  //     try {
  //       const response = await fetch(`/api/create-payment-intent`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials:"include",
  //         body: JSON.stringify({ amount }),
  //       })
  //       console.log("Here is the error",response)
  //       if (!response.ok) {
  //         const errorData = await response.json()
  //         throw new Error(errorData.error || "Failed to create payment intent")
  //       }

  //       const data = await response.json()
  //       setClientSecret(data.clientSecret)
  //     } catch (err: any) {
  //       setError(err.message || "An unexpected error occurred")
  //       console.error(err)
  //     }
  //   }

  //   createPaymentIntent()
  // }, [amount])
  // console.log(clientSecret)
  // Set up PaymentRequest for Apple Pay, Google Pay, etc.
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Shopcart Order",
          amount: amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      // Check if the Payment Request is available
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr)
        }
      })

      // Handle payment method
      pr.on("paymentmethod", async (ev) => {
        if (!clientSecret) {
          ev.complete("fail")
          return
        }

        // Confirm the PaymentIntent with the payment method
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false },
        )

        if (confirmError) {
          ev.complete("fail")
          setError(confirmError.message || "Payment failed")
        } else {
          ev.complete("success")
          if (paymentIntent.status === "requires_action") {
            // Let Stripe handle the rest of the payment flow
            const { error } = await stripe.confirmCardPayment(clientSecret)
            if (error) {
              setError(error.message || "Payment failed")
            } else {
              setSucceeded(true)
            }
          } else {
            // The payment has succeeded
            setSucceeded(true)
          }
        }
      })
    }
  }, [stripe, amount, clientSecret])

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  }

  const handleChange = (event: StripeCardElementChangeEvent) => {
    setError(event.error ? event.error.message : "")
  }

  // ... other imports and state variables ...

const handleSubmit = async (e: React.FormEvent) => {
  const { firstName, lastName, address1, address2, city, state, zipCode } = useBillingStore.getState();
  e.preventDefault();

  if (!stripe || !elements) {
    // Stripe.js hasn't yet loaded.
    // Disable form submission until Stripe.js has loaded.
    return;
  }

  setIsLoading(true);
  setError(null); // Clear previous errors

  try {
    // 1. Create PaymentIntent on form submission
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify({
        amount, // Send amount or any other necessary data
      }),
    });
    console.log("Here is the error",response)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create payment intent");
    }

    const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
 billing_details: {
 name: `${firstName} ${lastName}`,
 email: emailInputRef.current?.value,
 address: {
 line1: address1,
 line2: address2,
 city: city,
 state: state,
 postal_code: zipCode,
 },
 },
        card: CardElement,
      },
    });

    if (stripeError) {
      setError(stripeError.message || "An error occurred during payment confirmation");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded, handle success (e.g., redirect to success page)
      console.log("Payment successful:", paymentIntent);
      router.push("/payment-success"); // Example redirection
    } else {
      // Handle other payment intent statuses if needed
      console.log("Payment Intent status:", paymentIntent?.status);
      setError("Payment not successful. Please try again.");
    }

  } catch (err: any) {
    setError(err.message || "An unexpected error occurred");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

// ... rest of the component ...


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {paymentRequest && (
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">Express Checkout</label>
          <PaymentRequestButtonElement options={{ paymentRequest }} />
          <div className="relative flex py-5 items-center mt-4 mb-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">Or pay with card</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Card Information</label>
          <div className="border border-gray-300 rounded-md p-3 focus-within:ring-1 focus-within:ring-green-500">
            <CardElement options={cardStyle} onChange={handleChange} />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name on Card</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
              ref={nameInputRef}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
              ref={emailInputRef}
              placeholder="john.doe@example.com"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="saveCard" className="mr-2" />
        <label htmlFor="saveCard" className="text-sm text-gray-600">
          Save this card for future purchases
        </label>
      </div>

      <Button
        type="submit"
        // disabled={processing || !stripe || !clientSecret}
        className={`w-full ${
          succeeded ? "bg-green-600" : "bg-green-950"
        } hover:bg-green-900 text-white flex items-center justify-center`}
      >
        {processing ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : succeeded ? (
          "Payment Successful!"
        ) : (
          `Pay $${formattedAmount}`
        )}
      </Button>

      {succeeded && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mt-4">
          <p className="font-medium">Payment successful!</p>
          <p className="text-sm mt-1">Your order has been placed and will be processed shortly.</p>
        </div>
      )}
    </form>
  )
}
