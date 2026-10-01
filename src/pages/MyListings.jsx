import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function MyListings() {
  const navigate = useNavigate()

  const [myListings, setMyListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = localStorage.getItem("campusMarketToken")

        if (!token) {
          navigate("/login")
          return
        }

        const response = await fetch(
          "http://localhost:5000/api/products/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch your listings"
          )
        }

        setMyListings(data)
      } catch (error) {
        console.error("My listings error:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMyListings()
  }, [navigate])

  return (
    <main className="min-h-screen bg-[#f5f1e9]">

      <section className="border-b border-[#d9d0c3]">

        <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">

          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#817b72] transition hover:text-[#c65d45]"
          >
            ← Back to Profile
          </Link>

          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c65d45]">
                Selling
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#25231f] md:text-4xl">
                Selling Products
              </h1>

              <p className="mt-2 text-sm text-[#625e57]">
                Manage the products you're offering to other students.
              </p>

            </div>

            <Link
              to="/sell"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#c65d45] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#b9503a]"
            >
              <span className="text-base leading-none">
                +
              </span>
              Sell an item
            </Link>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">

        {loading ? (
          <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-[#d4cabc] bg-[#faf8f3]">
            <p className="text-sm text-[#817b72]">
              Loading your listings...
            </p>
          </div>
        ) : error ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-[#d4cabc] bg-[#faf8f3] px-6 text-center">

            <h2 className="text-lg font-bold text-[#302e2a]">
              Unable to load your listings
            </h2>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#817b72]">
              {error}
            </p>

          </div>
        ) : myListings.length === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-[#d4cabc] bg-[#faf8f3] px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d5cbbd] bg-[#f5f1e9] text-[#817b72]">
              <span className="text-xl">+</span>
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#302e2a]">
              You have no listings
            </h2>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#817b72]">
              List something you no longer need and sell it to another student.
            </p>

            <Link
              to="/sell"
              className="mt-6 rounded-full bg-[#302e2a] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#45413b]"
            >
              Sell an Item
            </Link>

          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {myListings.map((item) => (
              <ListingCard
                key={item._id}
                item={item}
                onEdit={() =>
                  navigate(`/edit-listing/${item._id}`)
                }
              />
            ))}

          </div>
        )}

      </section>

    </main>
  )
}

function ListingCard({ item, onEdit }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#d4cabc] bg-[#faf8f3] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(68,52,42,0.09)]">

      <div className="relative h-52 overflow-hidden bg-[#e5ded3]">

        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#817b72]">
            No image
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-[#faf8f3]/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#625e57] backdrop-blur">
          {item.condition}
        </div>

        <div className="absolute right-4 top-4 rounded-full bg-[#302e2a]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#f5f1e9] backdrop-blur">
          {item.status}
        </div>

      </div>

      <div className="p-5">

        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#c65d45]">
          {item.category}
        </p>

        <h2 className="mt-2 min-h-[40px] text-sm font-bold leading-5 tracking-[-0.02em] text-[#25231f]">
          {item.title}
        </h2>

        {item.seller && (
          <div className="mt-3">

            <p className="text-xs font-semibold text-[#302e2a]">
              {item.seller.name}
            </p>

            <p className="mt-0.5 text-[10px] text-[#817b72]">
              {item.seller.college}
            </p>

          </div>
        )}

        <div className="mt-5 flex items-center justify-between">

          <p className="text-lg font-bold tracking-[-0.025em] text-[#25231f]">
            ₹{Number(item.price).toLocaleString("en-IN")}
          </p>

          <button
            onClick={onEdit}
            className="rounded-full border border-[#d4cabc] px-4 py-2 text-[10px] font-bold text-[#625e57] transition hover:border-[#c65d45] hover:text-[#c65d45]"
          >
            Edit Listing
          </button>

        </div>

      </div>

    </article>
  )
}

export default MyListings