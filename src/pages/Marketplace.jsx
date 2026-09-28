import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"

const products = [
  {
    id: 1,
    title: "Engineering Mathematics — Vol. 2",
    price: 450,
    category: "Books & Notes",
    condition: "Good",
    location: "Library",
    time: "2h ago",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Casio Scientific Calculator",
    price: 850,
    category: "Electronics",
    condition: "Excellent",
    location: "Main Gate",
    time: "4h ago",
    image:
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "Firefox Student Bicycle",
    price: 3800,
    category: "Cycles",
    condition: "Good",
    location: "Hostel Block A",
    time: "6h ago",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "Clean Code — Robert C. Martin",
    price: 520,
    category: "Books & Notes",
    condition: "Like new",
    location: "Cafeteria",
    time: "8h ago",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    title: "Mechanical Keyboard",
    price: 2200,
    category: "Electronics",
    condition: "Excellent",
    location: "Academic Block",
    time: "1d ago",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    title: "Desk Lamp",
    price: 650,
    category: "Furniture",
    condition: "Good",
    location: "Hostel Block B",
    time: "1d ago",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    title: "Java Programming Notes",
    price: 250,
    category: "Books & Notes",
    condition: "Good",
    location: "Library",
    time: "2d ago",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    title: "Laptop Stand",
    price: 900,
    category: "Electronics",
    condition: "Like new",
    location: "Main Gate",
    time: "2d ago",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 9,
    title: "College Backpack",
    price: 700,
    category: "Other",
    condition: "Excellent",
    location: "Cafeteria",
    time: "3d ago",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
  },
]

const categories = [
  "All",
  "Books & Notes",
  "Electronics",
  "Cycles",
  "Furniture",
  "Clothing",
  "Other",
]

const conditions = [
  "Like new",
  "Excellent",
  "Good",
  "Fair",
]

function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryFromUrl = searchParams.get("category")

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(
    categories.includes(categoryFromUrl)
      ? categoryFromUrl
      : "All"
  )
  const [condition, setCondition] = useState("All")
  const [sort, setSort] = useState("Newest")
  const [showFilters, setShowFilters] = useState(false)

  /*
    Keep the selected category synchronized
    with the URL.
  */
  useEffect(() => {
    if (categories.includes(categoryFromUrl)) {
      setCategory(categoryFromUrl)
    } else {
      setCategory("All")
    }
  }, [categoryFromUrl])

  /*
    Change category AND update the URL.
  */
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)

    if (newCategory === "All") {
      setSearchParams({})
    } else {
      setSearchParams({
        category: newCategory,
      })
    }
  }

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (search.trim()) {
      const query = search.toLowerCase()

      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      )
    }

    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      )
    }

    if (condition !== "All") {
      result = result.filter(
        (product) => product.condition === condition
      )
    }

    if (sort === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price)
    }

    if (sort === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [search, category, condition, sort])

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#25231f]">

      {/* Search + categories */}

      <section className="sticky top-[68px] z-30 border-b border-[#ddd4c7] bg-[#f5f1e9]/95 backdrop-blur-md">

        <div className="mx-auto max-w-[1500px] px-3 py-3 sm:px-5 lg:px-7">

          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817b72]"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books, electronics, cycles..."
              className="h-11 w-full rounded-xl border border-[#d4cabc] bg-[#faf8f3] pl-10 pr-4 text-sm text-[#25231f] outline-none placeholder:text-[#9a9389] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => handleCategoryChange(item)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[10px] font-bold transition ${
                  category === item
                    ? "bg-[#302e2a] text-[#faf8f3]"
                    : "border border-[#d4cabc] bg-[#faf8f3] text-[#625e57]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main */}

      <section className="mx-auto max-w-[1500px] px-3 py-5 sm:px-5 sm:py-7 lg:px-7">

        {/* Mobile toolbar */}

        <div className="mb-4 flex items-center justify-between lg:hidden">

          <p className="text-xs font-semibold text-[#625e57]">
            {filteredProducts.length} items
          </p>

          <div className="flex gap-2">

            <button
              onClick={() => setShowFilters(true)}
              className="rounded-lg border border-[#d4cabc] bg-[#faf8f3] px-3 py-2 text-[10px] font-bold text-[#302e2a]"
            >
              ☷ Filter
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-[#d4cabc] bg-[#faf8f3] px-3 py-2 text-[10px] font-bold text-[#302e2a] outline-none"
            >
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>

          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[190px_minmax(0,1fr)]">

          {/* Desktop filters */}

          <aside className="hidden lg:block">

            <div className="sticky top-[150px] rounded-2xl border border-[#d4cabc] bg-[#faf8f3] p-5">

              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-[0.12em]">
                  Filters
                </h2>

                {(category !== "All" ||
                  condition !== "All") && (
                  <button
                    onClick={() => {
                      setCategory("All")
                      setCondition("All")
                      setSearchParams({})
                    }}
                    className="text-[9px] font-bold text-[#c65d45]"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="mt-6">

                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#817b72]">
                  Category
                </p>

                <div className="mt-3 space-y-2">

                  {categories.slice(1).map((item) => (
                    <button
                      key={item}
                      onClick={() => handleCategoryChange(item)}
                      className={`block w-full rounded-lg px-2.5 py-2 text-left text-xs ${
                        category === item
                          ? "bg-[#f1e4dc] font-bold text-[#c65d45]"
                          : "text-[#625e57] hover:bg-[#f3eee6]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}

                </div>
              </div>

              <div className="mt-7 border-t border-[#e1d9ce] pt-6">

                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#817b72]">
                  Condition
                </p>

                <div className="mt-3 space-y-2">

                  {conditions.map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-2 text-xs text-[#625e57]"
                    >
                      <input
                        type="radio"
                        checked={condition === item}
                        onChange={() => setCondition(item)}
                        className="accent-[#c65d45]"
                      />

                      {item}
                    </label>
                  ))}

                </div>
              </div>

              <div className="mt-7 border-t border-[#e1d9ce] pt-6">

                <label className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#817b72]">
                  Sort
                </label>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="mt-3 w-full rounded-lg border border-[#d4cabc] bg-[#f5f1e9] px-2.5 py-2 text-xs outline-none"
                >
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>

              </div>

            </div>
          </aside>

          {/* Products */}

          <div>

            <div className="mb-5 hidden items-end justify-between lg:flex">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c65d45]">
                  Campus marketplace
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em]">
                  Fresh on Campus
                </h1>
              </div>

              <p className="text-xs text-[#817b72]">
                {filteredProducts.length} items
              </p>

            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-[#d4cabc] bg-[#faf8f3] px-6 text-center">
                <div>
                  <p className="text-sm font-bold">
                    No items found
                  </p>

                  <p className="mt-1 text-xs text-[#817b72]">
                    Try another search or category.
                  </p>

                  <button
                    onClick={() => {
                      setSearch("")
                      setCategory("All")
                      setCondition("All")
                      setSearchParams({})
                    }}
                    className="mt-4 rounded-full bg-[#c65d45] px-5 py-2.5 text-[10px] font-bold text-white"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Mobile filter sheet */}

      {showFilters && (
        <div className="fixed inset-0 z-[70] lg:hidden">

          <button
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 bg-[#25231f]/40"
            aria-label="Close filters"
          />

          <div className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-[#faf8f3] p-5 shadow-2xl">

            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#d4cabc]" />

            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold">
                Filters
              </h2>

              <button
                onClick={() => setShowFilters(false)}
                className="text-xl text-[#817b72]"
              >
                ×
              </button>

            </div>

            <div className="mt-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#817b72]">
                Condition
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">

                {conditions.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCondition(item)}
                    className={`rounded-xl border px-3 py-3 text-left text-xs ${
                      condition === item
                        ? "border-[#c65d45] bg-[#f1e4dc] font-bold text-[#c65d45]"
                        : "border-[#d4cabc] bg-[#f5f1e9] text-[#625e57]"
                    }`}
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="mt-6 w-full rounded-full bg-[#c65d45] py-3.5 text-xs font-bold text-white"
            >
              Show {filteredProducts.length} items
            </button>

          </div>
        </div>
      )}

    </main>
  )
}

export default Marketplace