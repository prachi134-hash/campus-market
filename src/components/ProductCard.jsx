import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"

function ProductCard({ product, ...legacyProps }) {
  const navigate = useNavigate()

  const { addToCart } = useCart()

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist()

  const item = product || legacyProps

  const {
    id,
    title,
    price,
    category,
    condition,
    location,
    time,
    image,
  } = item

  const wishlisted = isInWishlist(id)

  const handleAdd = (event) => {
    event.stopPropagation()

    const user = localStorage.getItem("campusMarketUser")

    if (!user) {
      navigate("/login")
      return
    }

    addToCart(item)
  }

  const handleWishlist = (event) => {
    event.stopPropagation()

    toggleWishlist(item)
  }

  const handleProductClick = () => {
    navigate(`/product/${id}`, {
      state: {
        product: item,
      },
    })
  }

  return (
    <article
      onClick={handleProductClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-[#ddd4c7] bg-white"
    >

      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#eee9e0]">

        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg shadow-sm transition ${
            wishlisted
              ? "text-[#c65d45]"
              : "text-[#716b63] hover:text-[#c65d45]"
          }`}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          {wishlisted ? "♥" : "♡"}
        </button>

        {/* Condition */}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium text-[#302e2a]">
          {condition}
        </span>

      </div>

      {/* Product Information */}
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
          className="mt-4 w-full rounded-full bg-[#302e2a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#45413b]"
        >
          Add to Cart
        </button>

      </div>

    </article>
  )
}

export default ProductCard