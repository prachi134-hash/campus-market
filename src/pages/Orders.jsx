import { Link } from "react-router-dom"

const myOrders = [
  {
    id: "CM1001",
    title: "Engineering Mathematics — Vol. 2",
    price: 450,
    category: "Books & Notes",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
    meetupLocation: "Library",
    meetupDate: "To be scheduled",
    status: "Confirmed",
    paymentStatus: "Pending",
  },
]

function Orders() {
  return (
    <main className="min-h-screen bg-[#f5f1e9]">

      {/* Header */}

      <section className="border-b border-[#d9d0c3]">

        <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">

          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#817b72] transition hover:text-[#c65d45]"
          >
            ← Back to Profile
          </Link>

          <div className="mt-7">

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c65d45]">
              Purchases
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#25231f] md:text-4xl">
              Your Orders
            </h1>

            <p className="mt-2 text-sm text-[#625e57]">
              Keep track of the items you've purchased on Campus Market.
            </p>

          </div>

        </div>

      </section>

      {/* Orders */}

      <section className="mx-auto max-w-5xl px-6 py-10">

        {myOrders.length === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-[#d4cabc] bg-[#faf8f3] px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d5cbbd] bg-[#f5f1e9] text-[#817b72]">
              <span className="text-xl">□</span>
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#302e2a]">
              No orders yet
            </h2>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#817b72]">
              Products you purchase from the marketplace will appear here.
            </p>

            <Link
              to="/marketplace"
              className="mt-6 rounded-full bg-[#302e2a] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#45413b]"
            >
              Browse Marketplace
            </Link>

          </div>
        ) : (
          <div className="space-y-5">

            {myOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}

          </div>
        )}

      </section>

    </main>
  )
}

/* =========================================================
   ORDER CARD
========================================================= */

function OrderCard({ order }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#d4cabc] bg-[#faf8f3]">

      <div className="flex flex-col md:flex-row">

        {/* Product */}

        <div className="flex flex-1 gap-5 p-5 sm:p-6">

          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#e5ded3] sm:h-28 sm:w-28">

            <img
              src={order.image}
              alt={order.title}
              className="h-full w-full object-cover"
            />

          </div>

          <div className="min-w-0">

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#c65d45]">
              {order.category}
            </p>

            <h2 className="mt-2 text-sm font-bold leading-5 text-[#25231f] sm:text-base">
              {order.title}
            </h2>

            <p className="mt-2 text-lg font-bold text-[#25231f]">
              ₹{order.price.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-[10px] text-[#817b72]">
              Order #{order.id}
            </p>

          </div>

        </div>

        {/* Status */}

        <div className="border-t border-[#ded6ca] p-5 md:w-64 md:border-l md:border-t-0 sm:p-6">

          <div className="flex items-center justify-between md:block">

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#817b72]">
              Order status
            </p>

            <span className="rounded-full bg-[#e9eee4] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-[#5f7357]">
              {order.status}
            </span>

          </div>

          <div className="mt-5">

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#817b72]">
              Campus Meetup
            </p>

            <p className="mt-2 text-xs font-semibold text-[#302e2a]">
              {order.meetupLocation}
            </p>

            <p className="mt-1 text-xs text-[#817b72]">
              {order.meetupDate}
            </p>

          </div>

          <div className="mt-5 border-t border-[#ded6ca] pt-4">

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#817b72]">
              Payment
            </p>

            <p className="mt-2 text-xs font-semibold text-[#302e2a]">
              {order.paymentStatus}
            </p>

          </div>

        </div>

      </div>

    </article>
  )
}

export default Orders