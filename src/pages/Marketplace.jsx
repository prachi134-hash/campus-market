import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import API_URL from "../lib/api"

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

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(
    categories.includes(categoryFromUrl)
      ? categoryFromUrl
      : "All"
  )
  const [condition, setCondition] = useState("All")
  const [sort, setSort] = useState("Newest")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (categories.includes(categoryFromUrl)) {
      setCategory(categoryFromUrl)
    } else {
      setCategory("All")
    }
  }, [categoryFromUrl])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError("")

        const params = new URLSearchParams()

        if (search.trim()) {
          params.set("search", search.trim())
        }

        if (category !== "All") {
          params.set("category", category)
        }

        if (condition !== "All") {
          params.set("condition", condition)
        }

        if (sort === "Price: Low to High") {
          params.set("sort", "price_asc")
        } else if (sort === "Price: High to Low") {
          params.set("sort", "price_desc")
        } else {
          params.set("sort", "newest")
        }

        const queryString = params.toString()

        const response = await fetch(
          `${API_URL}/api/products${
            queryString ? `?${queryString}` : ""
          }`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          )
        }

        setProducts(data)
      } catch (error) {
        console.error("Marketplace error:", error)

        setError("Unable to load products.")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchProducts()
    }, 300)

    return () => clearTimeout(timer)
  }, [search, category, condition, sort])

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

  const clearFilters = () => {
    setSearch("")
    setCategory("All")
    setCondition("All")
    setSort("Newest")
    setSearchParams({})
  }

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#25231f]">

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

      <section className="mx-auto max-w-[1500px] px-3 py-5 sm:px-5 sm:py-7 lg:px-7">

        <div className="mb-4 flex items-center justify-between lg:hidden">

          <p className="text-xs font-semibold text-[#625e57]">
            {products.length} items
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

          <aside className="hidden lg:block">

            <div className="sticky top-[150px] rounded-2xl border border-[#d4cabc] bg-[#faf8f3] p-5">

              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-[0.12em]">
                  Filters
                </h2>

                {(category !== "All" ||
                  condition !== "All" ||
                  search.trim() ||
                  sort !== "Newest") && (
                  <button
                    onClick={clearFilters}
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
                {products.length} items
              </p>

            </div>

            {loading ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-[#d4cabc] bg-[#faf8f3] px-6 text-center">
                <div>
                  <p className="text-sm font-bold">
                    Loading products...
                  </p>

                  <p className="mt-1 text-xs text-[#817b72]">
                    Getting the latest listings.
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-[#d4cabc] bg-[#faf8f3] px-6 text-center">
                <div>
                  <p className="text-sm font-bold">
                    {error}
                  </p>

                  <p className="mt-1 text-xs text-[#817b0a]">
                    Please make sure the backend is running.
                  </p>
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
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
                    onClick={clearFilters}
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
              Show {products.length} items
            </button>

          </div>
        </div>
      )}

    </main>
  )
}

export default Marketplace