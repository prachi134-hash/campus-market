
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"

const fallbackProducts = {
  1: {
    id: 1,
    title: "Engineering Mathematics — Vol. 2",
    price: 450,
    category: "Books & Notes",
    condition: "Good",
    location: "Library",
    time: "2h ago",
    owner: "Aarav Sharma",
    college: "Cummins College of Engineering for Women",
    year: "3rd Year",
    description:
      "Engineering Mathematics reference book in good condition. Useful for students preparing for semester examinations.",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80",
  },

  2: {
    id: 2,
    title: "Casio Scientific Calculator",
    price: 850,
    category: "Electronics",
    condition: "Excellent",
    location: "Main Gate",
    time: "4h ago",
    owner: "Riya Patil",
    college: "Cummins College of Engineering for Women",
    year: "2nd Year",
    description:
      "Scientific calculator in excellent working condition. Suitable for engineering mathematics and examinations.",
    image:
      "https://images.unsplash.com/photo-1596495578060-5f0d5b9b9e5b?auto=format&fit=crop&w=900&q=80",
  },

  3: {
    id: 3,
    title: "Firefox Student Bicycle",
    price: 3800,
    category: "Cycles",
    condition: "Good",
    location: "Main Gate",
    time: "6h ago",
    owner: "Kunal Joshi",
    college: "Cummins College of Engineering for Women",
    year: "4th Year",
    description:
      "Student bicycle in good condition. Suitable for commuting around campus and nearby areas.",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
  },

  4: {
    id: 4,
    title: "Clean Code — Robert C. Martin",
    price: 520,
    category: "Books & Notes",
    condition: "Like new",
    location: "Cafeteria",
    time: "8h ago",
    owner: "Sneha Kulkarni",
    college: "Cummins College of Engineering for Women",
    year: "3rd Year",
    description:
      "Clean Code book in like-new condition. Useful for students learning software development and writing maintainable code.",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80",
  },

  5: {
    id: 5,
    title: "Mechanical Keyboard",
    price: 2200,
    category: "Electronics",
    condition: "Excellent",
    location: "Academic Block",
    time: "1d ago",
    owner: "Aditya Deshmukh",
    college: "Cummins College of Engineering for Women",
    year: "3rd Year",
    description:
      "Mechanical keyboard in excellent condition with clean keys and working switches.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
  },

  6: {
    id: 6,
    title: "Desk Lamp",
    price: 650,
    category: "Furniture",
    condition: "Good",
    location: "Main Gate",
    time: "1d ago",
    owner: "Meera Shah",
    college: "Cummins College of Engineering for Women",
    year: "2nd Year",
    description:
      "Compact study desk lamp in good working condition.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
  },

  7: {
    id: 7,
    title: "Java Programming Notes",
    price: 250,
    category: "Books & Notes",
    condition: "Good",
    location: "Library",
    time: "2d ago",
    owner: "Neha Gupta",
    college: "Cummins College of Engineering for Women",
    year: "3rd Year",
    description:
      "Handwritten and organized Java programming notes covering important concepts and examples.",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
  },

  8: {
    id: 8,
    title: "Laptop Stand",
    price: 900,
    category: "Electronics",
    condition: "Like new",
    location: "Main Gate",
    time: "2d ago",
    owner: "Ishita Jain",
    college: "Cummins College of Engineering for Women",
    year: "2nd Year",
    description:
      "Adjustable laptop stand in like-new condition.",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
  },

  9: {
    id: 9,
    title: "College Backpack",
    price: 700,
    category: "Other",
    condition: "Excellent",
    location: "Cafeteria",
    time: "3d ago",
    owner: "Rahul More",
    college: "Cummins College of Engineering for Women",
    year: "2nd Year",
    description:
      "Spacious college backpack in excellent condition with multiple compartments.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
}

function ProductDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const { addToCart } = useCart()
  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist()

  /*
    IMPORTANT:
    Marketplace sends some product information through router state.
    We merge it with fallback data so that the exact marketplace
    information is preserved while owner/college/description etc.
    are also available.
  */
  const fallbackProduct = fallbackProducts[id]

  const product = {
    ...fallbackProduct,
    ...location.state?.product,
  }

  if (!product.id) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-semibold text-[#302e2a]">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-[#716b63]">
            This product could not be found.
          </p>

          <button
            onClick={() => navigate("/marketplace")}
            className="mt-6 rounded-full bg-[#302e2a] px-6 py-3 text-sm font-medium text-white"
          >
            Back to Marketplace
          </button>
        </div>
      </main>
    )
  }

  const saved = isInWishlist(product.id)

  const handleAddToCart = () => {
    const user = localStorage.getItem("campusMarketUser")

    if (!user) {
      navigate("/login")
      return
    }

    addToCart(product)
  }

  const handleBuyNow = () => {
    const user = localStorage.getItem("campusMarketUser")

    if (!user) {
      navigate("/login")
      return
    }

    addToCart(product)
    navigate("/cart")
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee]">
      {/* Back */}
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

          {/* Product image */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-[#ddd4c7] bg-[#eee9e0]">
              <img
                src={product.image}
                alt={product.title}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product information */}
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

            {/* Seller */}
            <div className="mt-8 rounded-2xl border border-[#ddd4c7] bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b8378]">
                Seller
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#302e2a] text-sm font-semibold text-white">
                  {product.owner?.charAt(0) || "S"}
                </div>

                <div>
                  <p className="font-semibold text-[#302e2a]">
                    {product.owner || "Campus Market Seller"}
                  </p>

                  <p className="mt-1 text-xs text-[#716b63]">
                    {product.year || "Student"}
                  </p>
                </div>
              </div>
            </div>

            {/* College */}
            <div className="mt-4 rounded-2xl border border-[#ddd4c7] bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b8378]">
                College
              </p>

              <p className="mt-2 text-sm font-medium text-[#302e2a]">
                {product.college || "College information unavailable"}
              </p>
            </div>

            {/* Meetup */}
            <div className="mt-4 rounded-2xl border border-[#ddd4c7] bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b8378]">
                Campus Meetup
              </p>

              <div className="mt-3 flex items-start gap-3">
                <div className="text-lg">⌖</div>

                <div>
                  <p className="text-sm font-semibold text-[#302e2a]">
                    {product.location}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#716b63]">
                    Exact meetup details will be arranged after the
                    order is confirmed.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                onClick={handleBuyNow}
                className="rounded-full bg-[#302e2a] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#45413b]"
              >
                Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="rounded-full border border-[#302e2a] px-6 py-3.5 text-sm font-medium text-[#302e2a] transition hover:bg-[#302e2a] hover:text-white"
              >
                {saved ? "♥ Saved" : "♡ Save"}
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-3 w-full rounded-full border border-[#c65d45] px-6 py-3.5 text-sm font-medium text-[#c65d45] transition hover:bg-[#c65d45] hover:text-white"
            >
              Add to Cart
            </button>

            <p className="mt-4 text-center text-xs text-[#8b8378]">
              Campus meetup only · No delivery
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductDetails

