import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { amount } = await request.json()

    // For sandbox testing, we can return a mock order ID
    // In production, you would use the PayPal SDK to create a real order
    const orderID = "MOCK_ORDER_" + Math.random().toString(36).substring(2, 15)

    return NextResponse.json({
      orderID,
      success: true,
    })
  } catch (error: any) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json(
      {
        error: error.message || "Error creating PayPal order",
        success: false,
      },
      { status: 500 },
    )
  }
}
