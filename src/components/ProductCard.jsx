import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"

function ProductCard({
  product,
  id,
  title,
  price,
  category,
  condition,
  location,
  time,
  image,
}) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  // Supports both:
  // <ProductCard product={product} />
  // and the older:
  // <ProductCard title="" price="" image="" ... />
  const item = product || {
    id,
    title,
    price,
    category,
    condition,
    location,
    time,
    image,
  }

  const isLoggedIn =
    localStorage.getItem("campusMarketUser") !== null

  const handleAdd = (e) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: "/marketplace",
        },
      })
      return
    }

    addToCart(item)
  }

  const handleProductClick = () => {
    if (!item?.id) return

    navigate(`/product/${item.id}`, {
      state: {
        product: item,
      },
    })
  }

  return (
    <article
      onClick={handleProductClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-[#ddd4c7] bg-[#faf8f3] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#4b382f]/10"
    >
      <div className="relative aspect-square overflow-hidden bg-[#e9e2d7]">

        {item.image ? (
          <img
            src={item.image}
            alt={item.title || "Campus Market item"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#938b80]">
            No image
          </div>
        )}

        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#faf8f3]/90 text-[#625e57] backdrop-blur"
          aria-label="Save item"
        >
          ♡
        </button>
      </div>

      <div className="p-3">

        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[9px] font-bold uppercase tracking-[0.08em] text-[#c65d45]">
            {item.condition || "Good"}
          </span>

          {item.time && (
            <span className="shrink-0 text-[9px] text-[#938b80]">
              {item.time}
            </span>
          )}
        </div>

        <h3 className="mt-1.5 line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-4 text-[#302e2a]">
          {item.title || "Campus item"}
        </h3>

        <div className="mt-2.5 flex items-center justify-between gap-2">

          <div>
            <p className="text-[16px] font-bold leading-none text-[#25231f]">
              ₹{Number(item.price || 0).toLocaleString("en-IN")}
            </p>

            {item.location && (
              <p className="mt-1 truncate text-[9px] text-[#817b72]">
                {item.location}
              </p>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="flex h-8 min-w-[42px] items-center justify-center rounded-lg border border-[#c65d45] bg-[#faf8f3] px-3 text-[10px] font-extrabold uppercase tracking-wide text-[#c65d45] transition hover:bg-[#c65d45] hover:text-white"
          >
            ADD
          </button>

        </div>
      </div>
    </article>
  )
}

export default ProductCard

