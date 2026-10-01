import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import API_URL from "../lib/api"

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem(
                "campusMarketToken"
            )

            if (!token) {
                setWishlist([])
                setLoading(false)
                return
            }

            const response = await fetch(
                `${API_URL}/api/wishlist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch wishlist"
                )
            }

            const products = data.products || []

            const formattedProducts = products.map(
                (product) => ({
                    ...product,
                    id: product._id,
                })
            )

            setWishlist(formattedProducts)
        } catch (error) {
            console.error(
                "Fetch wishlist error:",
                error
            )

            setWishlist([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWishlist()

        const handleAuthChange = () => {
            fetchWishlist()
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

    const isInWishlist = (productId) => {
        return wishlist.some(
            (item) =>
                item.id === productId ||
                item._id === productId
        )
    }

    const addToWishlist = async (product) => {
        try {
            const token = localStorage.getItem(
                "campusMarketToken"
            )

            if (!token) {
                return
            }

            const productId = product._id || product.id

            const response = await fetch(
                `${API_URL}/api/wishlist`,
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
                        "Failed to add product to wishlist"
                )
            }

            const products = data.wishlist?.products || []

            const formattedProducts = products.map(
                (item) => ({
                    ...item,
                    id: item._id,
                })
            )

            setWishlist(formattedProducts)
        } catch (error) {
            console.error(
                "Add wishlist error:",
                error
            )
        }
    }

    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem(
                "campusMarketToken"
            )

            if (!token) {
                return
            }

            const response = await fetch(
                `${API_URL}/api/wishlist/${productId}`,
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
                        "Failed to remove product from wishlist"
                )
            }

            const products = data.wishlist?.products || []

            const formattedProducts = products.map(
                (item) => ({
                    ...item,
                    id: item._id,
                })
            )

            setWishlist(formattedProducts)
        } catch (error) {
            console.error(
                "Remove wishlist error:",
                error
            )
        }
    }

    const toggleWishlist = async (product) => {
        const productId = product._id || product.id

        if (isInWishlist(productId)) {
            await removeFromWishlist(productId)
        } else {
            await addToWishlist(product)
        }
    }

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                loading,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    return useContext(WishlistContext)
}