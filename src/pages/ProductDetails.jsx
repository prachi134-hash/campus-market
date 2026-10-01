import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { addToCart } = useCart()

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(false)
  const [isSeller, setIsSeller] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        )

        if (!response.ok) {
          throw new Error("Product not found")
        }

        const data = await response.json()

        if (data.status !== "AVAILABLE") {
          setProduct({
            unavailable: true,
          })
          return
        }

        setProduct({
          ...data,
          id: data._id,
        })

        const storedUser = localStorage.getItem(
          "campusMarketUser"
        )

        if (storedUser && data.seller) {
          try {
            const user = JSON.parse(storedUser)

            const loggedInUserId =
              user._id || user.id

            const sellerId =
              data.seller._id || data.seller.id

            if (
              loggedInUserId &&
              sellerId &&
              loggedInUserId.toString() ===
                sellerId.toString()
            ) {
              setIsSeller(true)
            }
          } catch (error) {
            console.error(
              "Failed to read logged-in user:",
              error
            )
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error
        )

        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-[#716b63]">
            Loading product...
          </p>
        </div>
      </main>
    )
  }

  if (!product || product.unavailable) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#c65d45]">
            Listing unavailable
          </p>

          <h1 className="text-3xl font-semibold text-[#302e2a]">
            This product is no longer available
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#716b63]">
            It may have been reserved or already sold.
            You can continue browsing other products
            on the marketplace.
          </p>

          <button
            onClick={() => navigate("/marketplace")}
            className="mt-6 rounded-full bg-[#302e2a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#45413b]"
          >
            Back to Marketplace
          </button>

        </div>
      </main>
    )
  }

  const saved = isInWishlist(product.id)

  const handleAddToCart = async () => {
    if (isSeller) {
      return
    }

    const user = localStorage.getItem(
      "campusMarketUser"
    )

    if (!user) {
      navigate("/login")
      return
    }

    setCartLoading(true)

    try {
      const success = await addToCart(product)

      if (!success) {
        return
      }
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      )
    } finally {
      setCartLoading(false)
    }
  }

  const handleBuyNow = async () => {
    if (isSeller) {
      return
    }

    const user = localStorage.getItem(
      "campusMarketUser"
    )

    if (!user) {
      navigate("/login")
      return
    }

    setCartLoading(true)

    try {
      const success = await addToCart(product)

      if (!success) {
        return
      }

      navigate("/cart")
    } catch (error) {
      console.error(
        "Buy now error:",
        error
      )
    } finally {
      setCartLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee]">

      <div className="mx-auto max-w-7xl px-6 pt-6 sm:px-8">

        <button
          onClick={() => navigate("/marketplace")}
          className="text-sm text-[#716b63] transition hover:text-[#302e2a]"
        >
          ← Back to Marketplace
        </button>

      </div>

      <section className="mx-auto max-w-7xl px-6 py-8 sm:px-8">

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">

          <div>

            <div className="relative overflow-hidden rounded-2xl border border-[#ddd4c7] bg-[#eee9e0]">

              <img
                src={
                  product.image ||
                  "https://via.placeholder.com/600"
                }
                alt={product.title}
                className="aspect-[4/3] h-full w-full object-cover"
              />

            </div>

          </div>

          <div>

            <div className="flex items-center justify-between gap-4">

              <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b8378]">
                {product.category}
              </span>

              <span className="rounded-full bg-[#e9e2d8] px-3 py-1 text-xs font-medium text-[#5f5951]">
                {product.condition}
              </span>

            </div>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#20201e] sm:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 text-3xl font-semibold text-[#c65d45]">
              ₹{product.price}
            </p>

            <p className="mt-6 text-sm leading-7 text-[#716b63]">
              {product.description}
            </p>

            <div className="mt-8 rounded-2xl border border-[#ddd4c7] bg-white p-5">

              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b8378]">
                Seller
              </p>

              {product.seller ? (
                <div className="mt-3 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#302e2a] text-sm font-semibold text-white">
                    {product.seller.name
                      ?.charAt(0)
                      ?.toUpperCase() || "S"}
                  </div>

                  <div>

                    <p className="font-semibold text-[#302e2a]">
                      {product.seller.name}
                    </p>

                    <p className="mt-1 text-xs text-[#716b63]">
                      {product.seller.course} ·{" "}
                      {product.seller.year}
                    </p>

                  </div>

                </div>
              ) : (
                <p className="mt-3 text-sm text-[#716b63]">
                  Seller information unavailable
                </p>
              )}

            </div>

            <div className="mt-4 rounded-2xl border border-[#ddd4c7] bg-white p-5">

              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b8378]">
                College
              </p>

              <p className="mt-2 text-sm font-medium text-[#302e2a]">
                {product.seller?.college ||
                  "College information unavailable"}
              </p>

            </div>

            <div className="mt-4 rounded-2xl border border-[#ddd4c7] bg-white p-5">

              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b8378]">
                Campus Meetup
              </p>

              <div className="mt-3 flex items-start gap-3">

                <div className="text-lg">
                  ⌖
                </div>

                <div>

                  <p className="text-sm font-semibold text-[#302e2a]">
                    {product.location}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#716b63]">
                    This is the seller-selected campus meetup location for this listing.
                  </p>

                </div>

              </div>

            </div>

            {isSeller ? (
              <div className="mt-7 rounded-2xl border border-[#ddd4c7] bg-[#eee9e0] p-5 text-center">

                <p className="text-sm font-semibold text-[#302e2a]">
                  This is your listing
                </p>

                <p className="mt-1 text-xs leading-5 text-[#716b63]">
                  You cannot purchase or add your own product to the cart.
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/edit-listing/${product.id}`
                    )
                  }
                  className="mt-4 rounded-full border border-[#302e2a] px-5 py-2.5 text-xs font-medium text-[#302e2a] transition hover:bg-[#302e2a] hover:text-white"
                >
                  Manage Listing
                </button>

              </div>
            ) : (
              <>
                <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">

                  <button
                    onClick={handleBuyNow}
                    disabled={cartLoading}
                    className="rounded-full bg-[#302e2a] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#45413b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cartLoading
                      ? "Adding..."
                      : "Buy Now"}
                  </button>

                  <button
                    onClick={() =>
                      toggleWishlist(product)
                    }
                    className="rounded-full border border-[#302e2a] px-6 py-3.5 text-sm font-medium text-[#302e2a] transition hover:bg-[#302e2a] hover:text-white"
                  >
                    {saved
                      ? "♥ Saved"
                      : "♡ Save"}
                  </button>

                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="mt-3 w-full rounded-full border border-[#c65d45] px-6 py-3.5 text-sm font-medium text-[#c65d45] transition hover:bg-[#c65d45] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cartLoading
                    ? "Adding..."
                    : "Add to Cart"}
                </button>

                <p className="mt-4 text-center text-xs text-[#8b8378]">
                  Campus meetup only · No delivery
                </p>
              </>
            )}

          </div>

        </div>

      </section>

    </main>
  )
}

export default ProductDetails