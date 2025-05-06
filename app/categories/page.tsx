import Link from "next/link"
import Image from "next/image"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Browse Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link href={`/categories/${category.slug}`} key={category.name}>
            <div className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-all">
              <div className="relative h-48 bg-gray-50">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-medium">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.itemCount} Items Available</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-green-950 font-medium">Shop Now</span>
                  <span className="text-sm text-gray-500">{category.brands} Brands</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const categories = [
  {
    name: "Furniture",
    slug: "furniture",
    itemCount: 240,
    brands: 12,
    image: "/images/categories/furniture.png",
  },
  {
    name: "Headphone",
    slug: "headphone",
    itemCount: 320,
    brands: 18,
    image: "/images/categories/headphone.png",
  },
  {
    name: "Shoe",
    slug: "shoe",
    itemCount: 520,
    brands: 24,
    image: "/images/categories/shoe.png",
  },
  {
    name: "Bag",
    slug: "bag",
    itemCount: 350,
    brands: 16,
    image: "/images/categories/bag.png",
  },
  {
    name: "Laptop",
    slug: "laptop",
    itemCount: 270,
    brands: 14,
    image: "/images/categories/laptop.png",
  },
  {
    name: "Book",
    slug: "book",
    itemCount: 315,
    brands: 22,
    image: "/images/categories/book.png",
  },
]
