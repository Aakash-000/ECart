interface OrderSummary {
  id: number;
  orderNumber: string;
  date: string; // Consider using Date type if you will parse it
  total: number; // Using number as it's a monetary value
  status: string; // e.g., "Processing", "Shipped", "Delivered"
  // Add other potentially useful properties:
  // numberOfItems: number;
  // shippingAddressSummary?: string; // A brief summary of the shipping address
  // paymentMethodSummary?: string; // A brief summary of the payment method
}