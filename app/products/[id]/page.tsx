"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useCart } from "@/context/cart-context"
import { use, useState } from "react"

interface Product {
  id: number
  name: string
  description: string
  price: string
  sku: string
  brand: string
  weight: string
  dimensions: string
  category_id: number
  created_at: string
  updated_at: string
  image_url: string
  alt_text: string
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)

  const {id} = use(params);

  const { data: product, isLoading, isError, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  })

  const fetchProduct = async (id: string | number): Promise<Product> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`, {
      method: "GET",
      credentials: "include",
    })
    if (!res.ok) {
      throw new Error("Failed to fetch product")
    }
    const data = await res.json()
    return data
  }

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      originalPrice: parseFloat(product.price), // No discount in provided data
      quantity: 1,
      image_url: product.image_url, // Use single image_url
      variant: "Default", // No colors in provided data
    })

    setAddedToCart(true)
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push("/cart")
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-6">Loading product...</div>
  }

  if (isError) {
    return <div className="container mx-auto px-4 py-6">Error loading product: {error.message}</div>
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-6">Product not found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image */}
        <div className="lg:w-1/2">
          <div className="relative h-80 bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={`http://localhost:3000${product.image_url}` || "/placeholder.svg"}
              alt={product.alt_text || product.name}
              fill
              className="object-contain p-4"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="mt-4">
            <span className="text-3xl font-bold">${parseFloat(product.price).toFixed(2)}</span>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Details</h3>
            <p className="text-gray-600"><strong>Brand:</strong> {product.brand}</p>
            <p className="text-gray-600"><strong>SKU:</strong> {product.sku}</p>
            <p className="text-gray-600"><strong>Dimensions:</strong> {product.dimensions}</p>
            <p className="text-gray-600"><strong>Weight:</strong> {product.weight}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mt-8 flex space-x-4">
            <Button
              className={`flex-1 ${addedToCart ? "bg-green-600" : "bg-green-950 hover:bg-green-900"} text-white`}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </>
              )}
            </Button>
            <Button variant="outline" className="px-4" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}