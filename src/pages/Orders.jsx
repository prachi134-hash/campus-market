import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem(
        "campusMarketToken"
      )

      if (!token) {
        setOrders([])
        return
      }

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch orders"
        )
      }

      setOrders(data)
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error
      )

      setOrders([])
    } finally {
      setLoading(false)
    }
  }

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

      <section className="mx-auto max-w-5xl px-6 py-10">

        {loading ? (
          <div className="flex min-h-[380px] items-center justify-center">

            <p className="text-sm text-[#817b72]">
              Loading your orders...
            </p>

          </div>
        ) : orders.length === 0 ? (
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
          <div className="space-y-6">

            {orders.map((order) => (
              <OrderGroup
                key={order._id}
                order={order}
                refreshOrders={fetchOrders}
              />
            ))}

          </div>
        )}

      </section>

    </main>
  )
}

function OrderGroup({
  order,
  refreshOrders,
}) {
  const [paymentLoading, setPaymentLoading] =
    useState(false)

  const paymentStatus =
    order.payment?.status || "PENDING"

  const activeItems = order.items.filter(
    (item) =>
      item.status !== "CANCELLED"
  )

  const hasPendingItems = activeItems.some(
    (item) => item.status === "PENDING"
  )

  const allItemsConfirmed =
    activeItems.length > 0 &&
    activeItems.every(
      (item) =>
        item.status === "CONFIRMED"
    )

  const canPay =
    paymentStatus === "PENDING" &&
    allItemsConfirmed

  const orderDate = new Date(
    order.createdAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const handlePayment = async () => {
    try {
      setPaymentLoading(true)

      const token = localStorage.getItem(
        "campusMarketToken"
      )

      if (!token) {
        alert("Please login to continue.")
        return
      }

      const response = await fetch(
        "http://localhost:5000/api/payments/mock",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            orderId: order._id,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Payment failed"
        )
      }

      alert("Mock payment successful!")

      await refreshOrders()
    } catch (error) {
      console.error(
        "Payment error:",
        error
      )

      alert(error.message)
    } finally {
      setPaymentLoading(false)
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[#d4cabc] bg-[#faf8f3]">

      {/* Order header */}

      <div className="border-b border-[#ded6ca] px-5 py-4 sm:px-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#817b72]">
              Order
            </p>

            <p className="mt-1 break-all text-xs font-semibold text-[#302e2a]">
              #{order._id}
            </p>

            <p className="mt-1 text-[10px] text-[#817b72]">
              Placed on {orderDate}
            </p>

          </div>

          <div className="sm:text-right">

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#817b72]">
              Order total
            </p>

            <p className="mt-1 text-lg font-bold text-[#25231f]">
              ₹{Number(
                order.totalAmount || 0
              ).toLocaleString("en-IN")}
            </p>

          </div>

        </div>

      </div>

      {/* Order items */}

      <div className="divide-y divide-[#ded6ca]">

        {order.items.map((item) => (
          <OrderItem
            key={item._id}
            item={item}
          />
        ))}

      </div>

      {/* Payment section */}

      <div className="border-t border-[#ded6ca] bg-[#f7f4ee] p-5 sm:p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#817b72]">
              Payment
            </p>

            {paymentStatus === "PAID" ? (
              <div>

                <p className="mt-2 text-xs font-semibold text-[#5f7357]">
                  Paid
                </p>

                {order.payment?.transactionId && (
                  <p className="mt-1 break-all text-[10px] text-[#817b72]">
                    Transaction:{" "}
                    {order.payment.transactionId}
                  </p>
                )}

              </div>
            ) : hasPendingItems ? (
              <p className="mt-2 text-xs text-[#817b72]">
                Waiting for all sellers to confirm the order.
              </p>
            ) : order.status === "CANCELLED" ? (
              <p className="mt-2 text-xs text-[#8d3f2d]">
                Payment unavailable for this order.
              </p>
            ) : (
              <p className="mt-2 text-xs text-[#302e2a]">
                All sellers have confirmed the order.
              </p>
            )}

          </div>

          {canPay && (
            <div className="w-full sm:w-64">

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full rounded-md bg-[#c65d45] px-5 py-3 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentLoading
                  ? "Processing..."
                  : `Pay ₹${Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}`}
              </button>

              <p className="mt-2 text-center text-[10px] leading-4 text-[#817b72]">
                Mock payment — no real money charged.
              </p>

            </div>
          )}

        </div>

      </div>

    </article>
  )
}

function OrderItem({ item }) {
  const product = item.product

  const status =
    item.status === "PENDING"
      ? "Pending"
      : item.status === "CONFIRMED"
      ? "Confirmed"
      : item.status === "COMPLETED"
      ? "Completed"
      : item.status === "CANCELLED"
      ? "Cancelled"
      : item.status

  const statusClass =
    item.status === "CANCELLED"
      ? "bg-[#f1dfda] text-[#8d3f2d]"
      : item.status === "COMPLETED"
      ? "bg-[#e3eee3] text-[#4f6e4e]"
      : item.status === "CONFIRMED"
      ? "bg-[#eee6d7] text-[#7b633d]"
      : "bg-[#e9eee4] text-[#5f7357]"

  return (
    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">

      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#e5ded3] sm:h-28 sm:w-28">

        <img
          src={
            product?.image ||
            "https://via.placeholder.com/300"
          }
          alt={product?.title || "Product"}
          className="h-full w-full object-cover"
        />

      </div>

      <div className="min-w-0 flex-1">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

          <div className="min-w-0">

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#c65d45]">
              {product?.category || "Product"}
            </p>

            <h2 className="mt-2 text-sm font-bold leading-5 text-[#25231f] sm:text-base">
              {product?.title || "Product unavailable"}
            </h2>

            <p className="mt-2 text-lg font-bold text-[#25231f]">
              ₹{Number(
                item.priceAtPurchase || 0
              ).toLocaleString("en-IN")}
            </p>

          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide ${statusClass}`}
          >
            {status}
          </span>

        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#817b72]">
              Seller
            </p>

            <p className="mt-1 text-xs font-semibold text-[#302e2a]">
              {item.seller?.name ||
                "Seller"}
            </p>

            {item.seller?.college && (
              <p className="mt-1 text-[10px] text-[#817b72]">
                {item.seller.college}
              </p>
            )}

          </div>

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#817b72]">
              Campus Meetup
            </p>

            <p className="mt-1 text-xs font-semibold text-[#302e2a]">
              {item.meetupLocation ||
                "Not specified"}
            </p>

            <p className="mt-1 text-[10px] text-[#817b72]">
              Seller-selected location
            </p>

          </div>

        </div>

        {item.status === "PENDING" && (
          <p className="mt-4 text-[10px] text-[#817b72]">
            Waiting for the seller to confirm this item.
          </p>
        )}

        {item.status === "CONFIRMED" && (
          <p className="mt-4 text-[10px] text-[#817b72]">
            Seller confirmed this item. Payment is available when all non-cancelled items in the order are confirmed.
          </p>
        )}

        {item.status === "COMPLETED" && (
          <p className="mt-4 text-[10px] font-medium text-[#5f7357]">
            This purchase has been completed.
          </p>
        )}

        {item.status === "CANCELLED" && (
          <p className="mt-4 text-[10px] text-[#8d3f2d]">
            This item was cancelled.
          </p>
        )}

      </div>

    </div>
  )
}

export default Orders