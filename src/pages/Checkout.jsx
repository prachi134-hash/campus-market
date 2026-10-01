import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import API_URL from "../lib/api"

function Checkout() {
  const navigate = useNavigate()

  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart()

  const [loading, setLoading] = useState(false)

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem(
        "campusMarketToken"
      )

      if (!token) {
        navigate("/login")
        return
      }

      if (!cart || cart.length === 0) {
        alert("Your cart is empty.")
        return
      }

      setLoading(true)

      const items = cart.map((item) => ({
        productId: item._id || item.id,
      }))

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to place order"
        )
      }

      await clearCart()

      alert("Order placed successfully!")

      navigate("/orders")
    } catch (error) {
      console.error(
        "Place order error:",
        error
      )

      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#f5f1e9] px-6 py-16">

        <div className="mx-auto max-w-3xl text-center">

          <h1 className="text-3xl font-semibold text-[#302e2a]">
            Your cart is empty
          </h1>

          <p className="mt-3 text-[#6f6a62]">
            Add a product before proceeding to checkout.
          </p>

          <button
            onClick={() => navigate("/marketplace")}
            className="mt-8 rounded-md bg-[#c65d45] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Browse Marketplace
          </button>

        </div>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f1e9] px-6 py-12">

      <div className="mx-auto max-w-5xl">

        <div className="mb-10">

          <p className="text-sm uppercase tracking-[0.18em] text-[#c65d45]">
            Campus Market
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#302e2a]">
            Checkout
          </h1>

          <p className="mt-2 text-[#6f6a62]">
            Review your items and meetup locations before placing your order.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_320px]">

          <section className="rounded-xl border border-[#d4cabc] bg-[#f7f4ee] p-6">

            <h2 className="text-lg font-semibold text-[#302e2a]">
              Your items
            </h2>

            <div className="mt-5 divide-y divide-[#d4cabc]">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-5"
                >

                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/100"
                    }
                    alt={item.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">

                    <h3 className="font-medium text-[#302e2a]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-[#6f6a62]">
                      {item.category}
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#302e2a]">
                      ₹{item.price}
                    </p>

                    <div className="mt-3">

                      <p className="text-xs uppercase tracking-wide text-[#8a8379]">
                        Meetup location
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#302e2a]">
                        {item.location ||
                          "Location not specified"}
                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </section>

          <aside className="h-fit rounded-xl border border-[#d4cabc] bg-[#f7f4ee] p-6">

            <h2 className="text-lg font-semibold text-[#302e2a]">
              Order summary
            </h2>

            <div className="mt-6 flex items-center justify-between text-sm">

              <span className="text-[#6f6a62]">
                Items
              </span>

              <span className="text-[#302e2a]">
                {cart.length}
              </span>

            </div>

            <div className="mt-3 flex items-center justify-between text-sm">

              <span className="text-[#6f6a62]">
                Total
              </span>

              <span className="font-semibold text-[#302e2a]">
                ₹{cartTotal}
              </span>

            </div>

            <div className="my-6 border-t border-[#d4cabc]" />

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full rounded-md bg-[#c65d45] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[#7b756c]">
              Payment will be available after the seller confirms your order.
            </p>

          </aside>

        </div>

      </div>

    </main>
  )
}

export default Checkout