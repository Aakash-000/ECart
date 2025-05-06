"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PayPalButtonProps {
  amount: number
  onSuccess: (transactionId: string) => void
  onError: (error: string) => void
}

declare global {
  interface Window {
    paypal?: any
  }
}

export default function PayPalButton({ amount, onSuccess, onError }: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)
  const paypalButtonRef = useRef<HTMLDivElement>(null)

  // Format amount for display
  const formattedAmount = amount.toFixed(2)

  useEffect(() => {
    // Only initialize PayPal if the script has loaded
    if (scriptLoaded && paypalButtonRef.current && window.paypal) {
      // Clear any existing buttons
      paypalButtonRef.current.innerHTML = ""

      try {
        setIsLoading(false)

        window.paypal
          .Buttons({
            // Set up the transaction
            createOrder: (data: any, actions: any) =>
              actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: formattedAmount,
                    },
                  },
                ],
              }),

            // Finalize the transaction
            onApprove: (data: any, actions: any) =>
              actions.order.capture().then((details: any) => {
                // Show a success message
                onSuccess(details.id || "PAYPAL_TRANSACTION_" + Math.random().toString(36).substring(2, 15))
              }),

            onError: (err: any) => {
              onError(err instanceof Error ? err.message : "Payment failed")
            },
          })
          .render(paypalButtonRef.current)
      } catch (error) {
        console.error("PayPal render error:", error)
        setScriptError("Failed to initialize PayPal buttons")
      }
    }
  }, [scriptLoaded, amount, formattedAmount, onSuccess, onError])

  return (
    <div className="py-8">
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb"}&currency=USD`}
        onLoad={() => setScriptLoaded(true)}
        onError={() => {
          setIsLoading(false)
          setScriptError("Failed to load PayPal script")
        }}
        strategy="lazyOnload"
      />

      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">Pay with PayPal</h3>
        <p className="text-gray-600 mb-4">
          Safe and secure payments with PayPal. You can pay with your PayPal account or credit card.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {scriptError && (
        <div className="text-center py-4">
          <p className="text-red-500 mb-4">{scriptError}</p>
          <p className="text-gray-600 mb-4">Please try again later or use a different payment method.</p>
        </div>
      )}

      <div ref={paypalButtonRef} className="paypal-button-container"></div>

      {/* Fallback button in case script fails to load */}
      {!isLoading && !scriptLoaded && !scriptError && (
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load PayPal. Please try again later.</p>
          <Button className="bg-[#0070BA] hover:bg-[#005ea6] text-white" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">Amount: ${formattedAmount} USD</div>
    </div>
  )
}
