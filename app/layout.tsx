import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import NavbarWrapper from "@/components/navbar-wrapper"
import QueryProvider from "@/components/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shopcart - Online Shopping",
  description: "Shop for headphones and electronics online"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <CartProvider>
            <NavbarWrapper />
            <main>{children}</main>
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
