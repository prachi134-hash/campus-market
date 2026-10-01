import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(true)

    // =====================================================
    // GET WISHLIST FROM BACKEND
    // =====================================================
    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem(
                "campusMarketToken"
            )

            // User is not logged in
            if (!token) {
                setWishlist([])
                setLoading(false)
                return
            }

            const response = await fetch(
                "http://localhost:5000/api/wishlist",
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

            // Backend returns:
            // {
            //   user: "...",
            //   products: [...]
            // }

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

    // =====================================================
    // LOAD WISHLIST WHEN USER LOGS IN
    // =====================================================
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

    // =====================================================
    // CHECK IF PRODUCT IS IN WISHLIST
    // =====================================================
    const isInWishlist = (productId) => {
        return wishlist.some(
            (item) =>
                item.id === productId ||
                item._id === productId
        )
    }

    // =====================================================
    // ADD TO WISHLIST
    // =====================================================
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
                "http://localhost:5000/api/wishlist",
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

    // =====================================================
    // REMOVE FROM WISHLIST
    // =====================================================
    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem(
                "campusMarketToken"
            )

            if (!token) {
                return
            }

            const response = await fetch(
                `http://localhost:5000/api/wishlist/${productId}`,
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

    // =====================================================
    // TOGGLE WISHLIST
    // =====================================================
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