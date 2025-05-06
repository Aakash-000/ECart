import Link from "next/link"
import Image from "next/image"

export default function ProductCategories() {
  return (
      <div className="mt-16">
        <h2 className="section-title">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
          {categories.map((category) => (
              <Link href={`/categories/${category.slug}`} key={category.name} className="group">
                <div className="bg-white p-6 rounded-2xl flex flex-col items-center transition-all hover:shadow-md border border-gray-100 hover:border-indigo-100">
                  <div className="relative w-16 h-16 mb-3 bg-indigo-50 rounded-full p-3">
                    <Image
                        src={category.icon || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-contain p-2"
                    />
                  </div>
                  <h3 className="font-medium text-center group-hover:text-indigo-600 transition-colors">{category.name}</h3>
                  <p className="text-xs text-gray-500 text-center mt-1">{category.itemCount} Items</p>
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
    icon: "/images/categories/furniture.png",
  },
  {
    name: "Headphone",
    slug: "headphone",
    itemCount: 320,
    icon: "/images/categories/headphone.png",
  },
  {
    name: "Shoe",
    slug: "shoe",
    itemCount: 520,
    icon: "/images/categories/shoe.png",
  },
  {
    name: "Bag",
    slug: "bag",
    itemCount: 350,
    icon: "/images/categories/bag.png",
  },
  {
    name: "Laptop",
    slug: "laptop",
    itemCount: 270,
    icon: "/images/categories/laptop.png",
  },
  {
    name: "Book",
    slug: "book",
    itemCount: 315,
    icon: "/images/categories/book.png",
  },
]
