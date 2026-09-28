import { useNavigate } from "react-router-dom"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"

function Wishlist() {
  const navigate = useNavigate()

  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist()

  const {
    addToCart,
  } = useCart()

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, {
      state: { product },
    })
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee]">
      
      {/* Page Header */}
      <section className="border-b border-[#ddd4c7]">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#8b8378]">
            Saved items
          </p>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#20201e] sm:text-4xl">
                Wishlist
              </h1>

              <p className="mt-2 text-sm text-[#716b63]">
                Items you want to keep an eye on.
              </p>
            </div>

            {wishlist.length > 0 && (
              <span className="text-sm text-[#716b63]">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8">

        {wishlist.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#ddd4c7] bg-[#f1ece3]">
              <span className="text-2xl text-[#8b8378]">
                ♡
              </span>
            </div>

            <h2 className="text-xl font-semibold text-[#302e2a]">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#716b63]">
              Save things you like while browsing the marketplace.
              They'll appear here for easy access later.
            </p>

            <button
              onClick={() => navigate("/marketplace")}
              className="mt-6 rounded-full bg-[#302e2a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#45413b]"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            
            {wishlist.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-[#ddd4c7] bg-white"
              >
                
                {/* Product Image */}
                <div
                  onClick={() => handleProductClick(product)}
                  className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-[#eee9e0]"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />

                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      removeFromWishlist(product.id)
                    }}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg text-[#c65d45] shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    ♥
                  </button>
                </div>

                {/* Product Information */}
                <div className="p-4">
                  
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-[#8b8378]">
                      {product.category}
                    </span>

                    <span className="text-[11px] text-[#8b8378]">
                      {product.condition}
                    </span>
                  </div>

                  <button
                    onClick={() => handleProductClick(product)}
                    className="block text-left"
                  >
                    <h2 className="line-clamp-2 text-base font-semibold text-[#302e2a] transition group-hover:text-[#c65d45]">
                      {product.title}
                    </h2>
                  </button>

                  <p className="mt-2 text-lg font-semibold text-[#20201e]">
                    ₹{product.price}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#716b63]">
                    <span>{product.location}</span>
                    <span>{product.time}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 w-full rounded-full border border-[#302e2a] px-4 py-2.5 text-sm font-medium text-[#302e2a] transition hover:bg-[#302e2a] hover:text-white"
                  >
                    Add to Cart
                  </button>

                </div>
              </article>
            ))}

          </div>
        )}

      </section>
    </main>
  )
}

export default Wishlist