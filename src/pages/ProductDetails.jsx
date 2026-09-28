import { useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useState } from "react"

function ProductDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [added, setAdded] = useState(false)
  const [fulfillment, setFulfillment] = useState("Campus Meetup")

  const product = location.state?.product

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f5f1e9] px-5 py-16 text-[#25231f]">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#d4cabc] bg-[#faf8f3] p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c65d45]">
            Product not found
          </p>

          <h1 className="mt-2 text-xl font-bold">
            This item could not be loaded.
          </h1>

          <p className="mt-2 text-sm text-[#817b72]">
            The product may have been removed or the page was opened directly.
          </p>

          <button
            onClick={() => navigate("/marketplace")}
            className="mt-6 rounded-full bg-[#c65d45] px-6 py-3 text-xs font-bold text-white"
          >
            Back to Marketplace
          </button>
        </div>
      </main>
    )
  }

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  const handleBuyNow = () => {
    addToCart(product)
    navigate("/cart")
  }

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#25231f]">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">

        <button
          onClick={() => navigate("/marketplace")}
          className="mb-6 flex items-center gap-2 text-xs font-bold text-[#625e57] transition hover:text-[#c65d45]"
        >
          ← Back to Marketplace
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

          {/* Product Image */}

          <div className="overflow-hidden rounded-2xl border border-[#d4cabc] bg-[#e9e2d7]">
            <div className="aspect-square">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#938b80]">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}

          <div className="flex flex-col">

            <div className="flex items-center justify-between gap-3">

              <span className="rounded-full bg-[#f1e4dc] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#c65d45]">
                {product.condition || "Good"}
              </span>

              <button
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4cabc] bg-[#faf8f3] text-lg text-[#625e57] transition hover:border-[#c65d45] hover:text-[#c65d45]"
                aria-label="Save item"
              >
                ♡
              </button>

            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c65d45]">
              {product.category}
            </p>

            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-[-0.03em] sm:text-3xl">
              {product.title}
            </h1>

            <p className="mt-5 text-3xl font-bold text-[#25231f]">
              ₹{Number(product.price || 0).toLocaleString("en-IN")}
            </p>

            {/* Location */}

            <div className="mt-6 border-y border-[#ddd4c7] py-5">
              <div className="flex items-start gap-3">

                <span className="mt-0.5 text-base">
                  ⌖
                </span>

                <div>
                  <p className="text-xs font-bold">
                    Pickup / Delivery location
                  </p>

                  <p className="mt-1 text-xs text-[#817b72]">
                    {product.location || "Campus location"}
                  </p>
                </div>

              </div>
            </div>

            {/* Fulfillment */}

            <div className="mt-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#817b72]">
                Fulfillment
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">

                <button
                  onClick={() => setFulfillment("Campus Meetup")}
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    fulfillment === "Campus Meetup"
                      ? "border-[#c65d45] bg-[#f1e4dc]"
                      : "border-[#d4cabc] bg-[#faf8f3]"
                  }`}
                >
                  <p
                    className={`text-xs font-bold ${
                      fulfillment === "Campus Meetup"
                        ? "text-[#c65d45]"
                        : "text-[#302e2a]"
                    }`}
                  >
                    Campus Meetup
                  </p>

                  <p className="mt-1 text-[10px] text-[#817b72]">
                    Meet the seller on campus
                  </p>
                </button>

                <button
                  onClick={() =>
                    setFulfillment("Seller-arranged Delivery")
                  }
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    fulfillment === "Seller-arranged Delivery"
                      ? "border-[#c65d45] bg-[#f1e4dc]"
                      : "border-[#d4cabc] bg-[#faf8f3]"
                  }`}
                >
                  <p
                    className={`text-xs font-bold ${
                      fulfillment === "Seller-arranged Delivery"
                        ? "text-[#c65d45]"
                        : "text-[#302e2a]"
                    }`}
                  >
                    Home Delivery
                  </p>

                  <p className="mt-1 text-[10px] text-[#817b72]">
                    Arranged by the seller
                  </p>
                </button>

              </div>
            </div>

            {/* Seller */}

            <div className="mt-6 rounded-xl border border-[#d4cabc] bg-[#faf8f3] p-4">

              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#817b72]">
                Seller
              </p>

              <div className="mt-3 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#302e2a] text-xs font-bold text-white">
                  AS
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Aarav Sharma
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#817b72]">
                    Cummins College · Nagpur
                  </p>
                </div>

              </div>
            </div>

            {/* Buttons */}

            <div className="mt-7 grid grid-cols-2 gap-3">

              <button
                onClick={handleAddToCart}
                className="rounded-xl border border-[#c65d45] bg-[#faf8f3] px-4 py-3.5 text-xs font-extrabold text-[#c65d45] transition hover:bg-[#c65d45] hover:text-white"
              >
                {added ? "Added ✓" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                className="rounded-xl bg-[#c65d45] px-4 py-3.5 text-xs font-extrabold text-white transition hover:bg-[#a94d39]"
              >
                Buy Now
              </button>

            </div>

          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductDetails