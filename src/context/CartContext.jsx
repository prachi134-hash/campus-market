import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import API_URL from "../lib/api"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const formatCartItems = (items) => {
    return (items || [])
      .filter((item) => item.product)
      .map((item) => ({
        ...item.product,
        id: item.product._id,
      }))
  }

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem(
        "campusMarketToken"
      )

      if (!token) {
        setCart([])
        return
      }

      const response = await fetch(
        `${API_URL}/api/cart`,
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
            "Failed to fetch cart"
        )
      }

      setCart(formatCartItems(data.items))
    } catch (error) {
      console.error(
        "Fetch cart error:",
        error
      )

      setCart([])
    }
  }

  useEffect(() => {
    fetchCart()

    const handleAuthChange = () => {
      fetchCart()
    }

    window.addEventListener(
      "campusMarketAuthChange",
      handleAuthChange
    )

    return () => {
      window.removeEventListener(
        "campusMarketAuthChange",
        handleAuthChange
      )
    }
  }, [])

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem(
        "campusMarketToken"
      )

      if (!token) {
        alert("Please login to add products to cart.")
        return false
      }

      const productId =
        product._id || product.id

      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add product to cart"
        )
      }

      setCart(formatCartItems(data.items))

      return true
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      )

      alert(error.message)

      return false
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem(
        "campusMarketToken"
      )

      if (!token) {
        return
      }

      const response = await fetch(
        `${API_URL}/api/cart/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to remove product from cart"
        )
      }

      setCart(formatCartItems(data.items))
    } catch (error) {
      console.error(
        "Remove from cart error:",
        error
      )
    }
  }

  const clearCart = async () => {
    try {
      const token = localStorage.getItem(
        "campusMarketToken"
      )

      if (!token) {
        setCart([])
        return
      }

      const currentItems = [...cart]

      for (const item of currentItems) {
        await fetch(
          `${API_URL}/api/cart/${item.id}`,
          {
            method: "DELETE",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      }

      setCart([])
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      )

      setCart([])
    }
  }

  const cartCount = cart.length

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}