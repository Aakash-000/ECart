import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import ProductCategories from "@/components/product-categories"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading, initializeAuthState } = useAuthStore()

  useEffect(() => {
    initializeAuthState();
  }, [initializeAuthState]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return isAuthenticated && (
    <>
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl mb-10 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="p-6 md:p-10 md:w-1/2 flex flex-col justify-center">
              <span className="mb-4">Special Offer</span>
              <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                Grab Upto 50% Off On
                <br />
                Selected Headphone
              </h1>
              <div className="mt-4">
                <Button className="btn-primary">Buy Now</Button>
              </div>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <Image
                  src="/images/hero-headphones.png"
                  alt="Premium headphones on sale"
                  fill
                  className="object-cover object-center"
                  priority
              />
            </div>
          </div>
        </div>

        {/* Product Categories Section */}
        <ProductCategories />

        {/* Conditional rendering based on authentication */}

        {/* Featured Products Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Headphones For You!</h2>
            <Link href="/products" className="text-indigo-600 font-medium flex items-center hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <div className="product-card rounded-2xl overflow-hidden group">
                    <div className="relative h-48 bg-gray-50">
                      <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                      />
                      <button className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-indigo-50 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                              d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
                              stroke="#4F46E5"
                              strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg">{product.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-lg font-bold text-indigo-900">${product.price}</span>
                        {product.originalPrice && (
                            <span className="text-gray-500 line-through ml-2">${product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                  <svg
                                      key={i}
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill={i < product?.rating ? "#FBBF24" : "none"}
                                      xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                                        stroke={i < product.rating ? "#FBBF24" : "#CBD5E0"}
                                        strokeWidth="1.5"
                                    />
                                  </svg>
                              ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                      <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">Add to Cart</Button>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </>
  )
}

// Define the type for a featured product to include originalPrice
interface FeaturedProduct {
  id: number;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  originalPrice?: string; // Make originalPrice optional
}

const featuredProducts = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: "89.99",
    originalPrice: "99.99",
    rating: 4,
    reviews: 121,
    image: "/images/products/wireless-earbuds.png",
  },
  {
    id: 2,
    name: "Airpods Max",
    price: "549.00",
    originalPrice: "200",
    rating: 5,
    reviews: 89,
    image: "/images/products/airpods-max.png",
  },
  {
    id: 3, // 🆕 changed from 4
    name: "VIVEFOX Headphones",
    price: "39.99",
    originalPrice: "49.99",
    rating: 4, // ✅ added missing rating
    reviews: 56,
    image: "/images/products/bose-headphones.png",
  },
  {
    id: 4,
    name: "VIVEFOX Headphones",
    price: "39.99",
    originalPrice: "49.99",
    rating: 3,
    reviews: 42,
    image: "/images/products/vivefox-headphones.png",
  },
]

