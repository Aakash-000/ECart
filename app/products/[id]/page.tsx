"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import Link from "next/link"
import { use, useState } from "react"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  finalPrice: number;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  colors: { name: string; value: string }[];
  images: string[];
}


export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const {id} = use(params);
  console.log(params)


  const { data: product, isLoading, isError, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

  const fetchProduct = async (id: string | number): Promise<Product> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,{
      method:"GET",
      credentials:"include"
    });
    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }
    console.log(res)
    const data = await res.json();
    console.log(data)
    return data;
  };
  
  console.log(product)
  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.finalPrice,
      originalPrice: product.price,
      quantity: 1,
      image: product.images[0],
      variant: `Color: ${product.colors[selectedColor].name}`,
    });


    setAddedToCart(true);

    // Reset the "Added to Cart" message after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };


  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-6">Loading product...</div>;
  }

  if (isError) {
    return <div className="container mx-auto px-4 py-6">Error loading product: {error.message}</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-6">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="grid grid-cols-2 gap-4">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`relative ${index === 0 ? "col-span-2 h-80" : "h-40"} bg-gray-50 rounded-lg overflow-hidden`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-contain p-4"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center mt-2">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <svg
                    key={i}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={i < product.rating ? "#FFD700" : "none"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                      stroke={i < product.rating ? "#FFD700" : "#CBD5E0"}
                      strokeWidth="1.5"
                    />
                  </svg>
                ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
          </div>

          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-3xl font-bold">${product.finalPrice.toFixed(2)}</span>
              <span className="text-xl text-gray-500 line-through ml-3">${product.price.toFixed(2)}</span>
              {product.discount && (
                <span className="ml-3 bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                  {product.discount}% Discount
                </span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Select Color</h3>
            <div className="flex space-x-3">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 ${index === selectedColor ? "border-green-500" : "border-transparent"}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(index)}
                >
                  {index === selectedColor && <Check size={16} className="text-white mx-auto" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Features</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
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

      {/* Similar Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="border border-gray-200 rounded-lg overflow-hidden group">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="font-bold">${product.price}</span>
                  </div>
                  <Button
                    className="w-full mt-3 bg-green-950 hover:bg-green-900 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: Number.parseFloat(product.price),
                        quantity: 1,
                        image: product.image,
                      });
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const similarProducts = [
  {
    id: 1,
    name: "Wireless Earbuds, IPX8",
    price: "89.99",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Bose BT Earphones",
    price: "289.99",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "VIVEFOX Headphones",
    price: "39.99",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "JBL TUNE 660BTNC",
    price: "99.99",
    image: "/placeholder.svg?height=200&width=200",
  },
];
