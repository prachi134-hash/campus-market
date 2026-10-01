import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"

function ProductCard({ product, ...legacyProps }) {
  const navigate = useNavigate()

  const {
    addToCart,
    cart,
  } = useCart()

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist()

  const item = product || legacyProps

  const productId = item._id || item.id

  const {
    title,
    price,
    category,
    condition,
    location,
    time,
    image,
    status,
  } = item

  const wishlisted = isInWishlist(productId)

  const isUnavailable =
    status === "RESERVED" || status === "SOLD"

  const isInCart = cart.some(
    (cartItem) =>
      (cartItem._id || cartItem.id) === productId
  )

  const handleAdd = (event) => {
    event.stopPropagation()

    if (isUnavailable || isInCart) {
      return
    }

    const user = localStorage.getItem(
      "campusMarketUser"
    )

    if (!user) {
      navigate("/login")
      return
    }

    addToCart({
      ...item,
      id: productId,
    })
  }

  const handleWishlist = (event) => {
    event.stopPropagation()

    if (isUnavailable) {
      return
    }

    toggleWishlist({
      ...item,
      id: productId,
    })
  }

  const handleProductClick = () => {
    navigate(`/product/${productId}`, {
      state: {
        product: {
          ...item,
          id: productId,
        },
      },
    })
  }

  return (
    <article
      onClick={handleProductClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-[#ddd4c7] bg-white"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#eee9e0]">
        <img
          src={image}
          alt={title}
          className={`h-full w-full object-cover transition duration-300 ${
            isUnavailable
              ? "opacity-70"
              : "group-hover:scale-[1.02]"
          }`}
        />

        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="rounded-full bg-white/95 px-5 py-2 text-xs font-bold tracking-[0.18em] text-[#302e2a]">
              UNAVAILABLE
            </span>
          </div>
        )}

        <button
          onClick={handleWishlist}
          disabled={isUnavailable}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg shadow-sm transition ${
            isUnavailable
              ? "cursor-not-allowed text-[#b8b1a7]"
              : wishlisted
                ? "text-[#c65d45]"
                : "text-[#716b63] hover:text-[#c65d45]"
          }`}
          aria-label={
            isUnavailable
              ? "Product unavailable"
              : wishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
          }
        >
          {wishlisted ? "♥" : "♡"}
        </button>

        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium text-[#302e2a]">
          {condition}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium uppercase tracking-wide text-[#8b8378]">
            {category}
          </span>

          <span className="text-[11px] text-[#8b8378]">
            {time}
          </span>
        </div>

        <h3 className="line-clamp-2 text-base font-semibold text-[#302e2a]">
          {title}
        </h3>

        <p className="mt-2 text-lg font-semibold text-[#20201e]">
          ₹{price}
        </p>

        <div className="mt-2 text-xs text-[#716b63]">
          {location}
        </div>

        <button
          onClick={handleAdd}
          disabled={isUnavailable || isInCart}
          className={`mt-4 w-full rounded-full px-4 py-2.5 text-sm font-medium transition ${
            isUnavailable
              ? "cursor-not-allowed bg-[#ddd8d0] text-[#8b8378]"
              : isInCart
                ? "cursor-default bg-[#e8e2d8] text-[#302e2a]"
                : "bg-[#302e2a] text-white hover:bg-[#45413b]"
          }`}
        >
          {isUnavailable
            ? "Unavailable"
            : isInCart
              ? "Added to Cart"
              : "Add to Cart"}
        </button>
      </div>
    </article>
  )
}

export default ProductCard