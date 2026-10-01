import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"

function Cart() {
  const navigate = useNavigate()

  const {
    cart,
    removeFromCart,
    cartTotal,
  } = useCart()

  const deliveryCharge = 0
  const total = cartTotal + deliveryCharge

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#25231f]">

      {/* =====================================================
          PAGE INTRO
      ===================================================== */}
      <section className="border-b border-[#d9d0c3]">

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 md:py-10">

          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#c65d45]" />

            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#c65d45]">
              Your selection
            </p>
          </div>

          <div className="mt-3 flex items-end justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold tracking-[-0.045em] md:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-[#625e57]">
                Review your items before checking out.
              </p>
            </div>

            {cart.length > 0 && (
              <p className="hidden text-xs font-semibold text-[#817b72] sm:block">
                {cart.length}{" "}
                {cart.length === 1 ? "item" : "items"}
              </p>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          EMPTY CART
      ===================================================== */}
      {cart.length === 0 ? (

        <section className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center px-6 py-16">

          <div className="w-full rounded-[24px] border border-dashed border-[#d4cabc] bg-[#faf8f3] px-6 py-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d4cabc] bg-[#f5f1e9] text-2xl text-[#c65d45]">
              🛒
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c65d45]">
              Nothing here yet
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Your cart is empty.
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#817b72]">
              Find something useful from the campus marketplace and add it
              to your cart.
            </p>

            <button
              onClick={() => navigate("/marketplace")}
              className="mt-6 rounded-full bg-[#c65d45] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#b9503a]"
            >
              Browse Marketplace
            </button>

          </div>

        </section>

      ) : (

        /* =====================================================
            CART CONTENT
        ===================================================== */
        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 md:py-12">

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">

            {/* =================================================
                CART ITEMS
            ================================================= */}
            <div>

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#c65d45]">
                    Items
                  </p>

                  <h2 className="mt-1 text-xl font-bold tracking-[-0.03em]">
                    Ready for checkout
                  </h2>
                </div>

                <button
                  onClick={() => navigate("/marketplace")}
                  className="text-[10px] font-bold text-[#c65d45] transition hover:text-[#a94d39]"
                >
                  Continue shopping →
                </button>

              </div>

              <div className="space-y-3">

                {cart.map((item) => (

                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-[#d4cabc] bg-[#faf8f3]"
                  >

                    <div className="flex gap-4 p-4 sm:p-5">

                      {/* Product image */}
                      <button
                        onClick={() =>
                          navigate(`/product/${item.id}`, {
                            state: {
                              product: item,
                            },
                          })
                        }
                        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#e9e2d7] sm:h-28 sm:w-28"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-[#938b80]">
                            No image
                          </div>
                        )}
                      </button>

                      {/* Product information */}
                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#c65d45]">
                              {item.category || "Campus item"}
                            </p>

                            <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-[#302e2a]">
                              {item.title}
                            </h3>

                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="shrink-0 text-lg leading-none text-[#938b80] transition hover:text-[#c65d45]"
                            aria-label={`Remove ${item.title}`}
                          >
                            ×
                          </button>

                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">

                          <span className="rounded-full bg-[#f1e4dc] px-2.5 py-1 text-[9px] font-bold text-[#c65d45]">
                            {item.condition || "Good"}
                          </span>

                          {item.location && (
                            <span className="text-[9px] text-[#817b72]">
                              Meetup: {item.location}
                            </span>
                          )}

                        </div>

                        {/* Price */}
                        <div className="mt-4 flex items-end justify-end">

                          <div className="text-right">

                            <p className="text-[10px] text-[#817b72]">
                              Individual item
                            </p>

                            <p className="mt-0.5 text-base font-bold text-[#25231f]">
                              ₹
                              {Number(item.price || 0).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

              {/* Meetup note */}
              <div className="mt-5 rounded-2xl border border-[#d4cabc] bg-[#faf8f3] p-4 sm:p-5">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1e4dc] text-[#c65d45]">
                    ⌖
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#302e2a]">
                      Campus Meetup
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-[#817b72]">
                      Orders on Campus Market currently use campus
                      meetup for handover. You'll choose the meetup
                      details during checkout.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                ORDER SUMMARY
            ================================================= */}
            <aside>

              <div className="sticky top-24 rounded-2xl border border-[#d4cabc] bg-[#faf8f3] p-5">

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#c65d45]">
                  Summary
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Order summary
                </h2>

                <div className="mt-6 space-y-3 border-b border-[#ded6ca] pb-5">

                  <div className="flex items-center justify-between text-xs text-[#625e57]">
                    <span>Subtotal</span>

                    <span className="font-semibold text-[#302e2a]">
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#625e57]">
                    <span>Meetup</span>

                    <span className="font-semibold text-[#3f7a54]">
                      Free
                    </span>
                  </div>

                </div>

                <div className="flex items-end justify-between pt-5">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#817b72]">
                      Total
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#25231f]">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <p className="text-[9px] text-[#817b72]">
                    Inclusive of all charges
                  </p>

                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-6 w-full rounded-xl bg-[#c65d45] px-5 py-3.5 text-xs font-extrabold text-white transition hover:bg-[#b9503a] hover:shadow-lg hover:shadow-[#c65d45]/20"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/marketplace")}
                  className="mt-3 w-full rounded-xl border border-[#d4cabc] bg-[#f5f1e9] px-5 py-3 text-xs font-bold text-[#625e57] transition hover:border-[#c65d45] hover:text-[#c65d45]"
                >
                  Continue Shopping
                </button>

              </div>

            </aside>

          </div>

        </section>

      )}

    </main>
  )
}

export default Cart