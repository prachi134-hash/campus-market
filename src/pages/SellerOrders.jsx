
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function SellerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] =
    useState(null)

  const fetchSellerOrders = async () => {
    try {
      const token = localStorage.getItem(
        "campusMarketToken"
      )

      if (!token) {
        setOrders([])
        return
      }

      const response = await fetch(
        "http://localhost:5000/api/orders/seller",
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
            "Failed to fetch seller orders"
        )
      }

      setOrders(data)
    } catch (error) {
      console.error(
        "Fetch seller orders error:",
        error
      )

      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSellerOrders()
  }, [])

  const handleConfirm = async (
    orderId,
    itemId
  ) => {
    try {
      setActionLoading(
        `${orderId}-${itemId}-confirm`
      )

      const token = localStorage.getItem(
        "campusMarketToken"
      )

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/items/${itemId}/confirm`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to confirm order"
        )
      }

      await fetchSellerOrders()

      alert(
        "Order confirmed successfully!"
      )
    } catch (error) {
      console.error(
        "Confirm order error:",
        error
      )

      alert(error.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleComplete = async (
    orderId,
    itemId
  ) => {
    try {
      setActionLoading(
        `${orderId}-${itemId}-complete`
      )

      const token = localStorage.getItem(
        "campusMarketToken"
      )

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/items/${itemId}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to complete order"
        )
      }

      await fetchSellerOrders()

      alert(
        "Order completed successfully!"
      )
    } catch (error) {
      console.error(
        "Complete order error:",
        error
      )

      alert(error.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (
    orderId,
    itemId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    )

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(
        `${orderId}-${itemId}-cancel`
      )

      const token = localStorage.getItem(
        "campusMarketToken"
      )

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/items/${itemId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to cancel order"
        )
      }

      await fetchSellerOrders()

      alert(
        "Order cancelled successfully!"
      )
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      )

      alert(error.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f1e9] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-[#6d675f]">
            Loading your sales...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f1e9] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#c65d45]">
            Seller dashboard
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-[#302e2a]">
            My Sales
          </h1>

          <p className="mt-3 max-w-2xl text-[#6d675f]">
            View and manage orders placed for
            your products.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-[#d4cabc] bg-[#fffdf8] px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold text-[#302e2a]">
              No sales yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-[#6d675f]">
              When someone purchases one of
              your listed products, the order
              will appear here.
            </p>

            <Link
              to="/my-listings"
              className="mt-6 inline-flex rounded-full bg-[#c65d45] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#b9523c]"
            >
              View My Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) =>
              order.items.map((item) => {
                const actionKey =
                  `${order._id}-${item._id}`

                const confirmLoading =
                  actionLoading ===
                  `${actionKey}-confirm`

                const completeLoading =
                  actionLoading ===
                  `${actionKey}-complete`

                const cancelLoading =
                  actionLoading ===
                  `${actionKey}-cancel`

                const isPaid =
                  order.payment?.status ===
                  "PAID"

                return (
                  <div
                    key={actionKey}
                    className="rounded-3xl border border-[#d4cabc] bg-[#fffdf8] p-6"
                  >
                    <div className="flex flex-col gap-6 md:flex-row">
                      <div className="h-32 w-full shrink-0 overflow-hidden rounded-2xl bg-[#eee8de] md:h-32 md:w-32">
                        {item.product?.image ? (
                          <img
                            src={
                              item.product.image
                            }
                            alt={
                              item.product.title
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-[#8b847a]">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-[#302e2a]">
                              {item.product
                                ?.title ||
                                "Product"}
                            </h2>

                            <p className="mt-1 text-lg font-medium text-[#c65d45]">
                              ₹
                              {
                                item.priceAtPurchase
                              }
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                              item.status ===
                              "PENDING"
                                ? "bg-[#f3e8d7] text-[#8a6335]"
                                : item.status ===
                                  "CONFIRMED"
                                ? "bg-[#e7eee6] text-[#4d694e]"
                                : item.status ===
                                  "COMPLETED"
                                ? "bg-[#dfe9df] text-[#3f6041]"
                                : "bg-[#f3e0db] text-[#9a4939]"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <p className="text-[#8b847a]">
                              Order ID
                            </p>

                            <p className="mt-1 break-all font-medium text-[#302e2a]">
                              {order._id}
                            </p>
                          </div>

                          <div>
                            <p className="text-[#8b847a]">
                              Buyer
                            </p>

                            <p className="mt-1 font-medium text-[#302e2a]">
                              {
                                order.buyer
                                  ?.name
                              }
                            </p>

                            {order.buyer
                              ?.college && (
                              <p className="mt-0.5 text-[#6d675f]">
                                {
                                  order.buyer
                                    .college
                                }
                              </p>
                            )}
                          </div>

                          <div>
                            <p className="text-[#8b847a]">
                              Meetup Location
                            </p>

                            <p className="mt-1 font-medium text-[#302e2a]">
                              {
                                item.meetupLocation
                              }
                            </p>
                          </div>

                          <div>
                            <p className="text-[#8b847a]">
                              Payment
                            </p>

                            <p className="mt-1 font-medium text-[#302e2a]">
                              {isPaid
                                ? "Paid"
                                : "Pending"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[#8b847a]">
                              Order Date
                            </p>

                            <p className="mt-1 font-medium text-[#302e2a]">
                              {new Date(
                                order.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          {item.status ===
                            "PENDING" && (
                            <>
                              <button
                                onClick={() =>
                                  handleConfirm(
                                    order._id,
                                    item._id
                                  )
                                }
                                disabled={
                                  actionLoading !==
                                  null
                                }
                                className="rounded-full bg-[#c65d45] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b9523c] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {confirmLoading
                                  ? "Confirming..."
                                  : "Confirm Order"}
                              </button>

                              <button
                                onClick={() =>
                                  handleCancel(
                                    order._id,
                                    item._id
                                  )
                                }
                                disabled={
                                  actionLoading !==
                                  null
                                }
                                className="rounded-full border border-[#c65d45] px-5 py-2.5 text-sm font-medium text-[#c65d45] transition hover:bg-[#f7ebe6] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {cancelLoading
                                  ? "Cancelling..."
                                  : "Cancel Order"}
                              </button>
                            </>
                          )}

                          {item.status ===
                            "CONFIRMED" &&
                            !isPaid && (
                              <>
                                <div className="rounded-full bg-[#f3e8d7] px-5 py-2.5 text-sm font-medium text-[#8a6335]">
                                  Waiting for buyer payment
                                </div>

                                <button
                                  onClick={() =>
                                    handleCancel(
                                      order._id,
                                      item._id
                                    )
                                  }
                                  disabled={
                                    actionLoading !==
                                    null
                                  }
                                  className="rounded-full border border-[#c65d45] px-5 py-2.5 text-sm font-medium text-[#c65d45] transition hover:bg-[#f7ebe6] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {cancelLoading
                                    ? "Cancelling..."
                                    : "Cancel Order"}
                                </button>
                              </>
                            )}

                          {item.status ===
                            "CONFIRMED" &&
                            isPaid && (
                              <button
                                onClick={() =>
                                  handleComplete(
                                    order._id,
                                    item._id
                                  )
                                }
                                disabled={
                                  actionLoading !==
                                  null
                                }
                                className="rounded-full bg-[#c65d45] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b9523c] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {completeLoading
                                  ? "Completing..."
                                  : "Mark as Completed"}
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default SellerOrders

