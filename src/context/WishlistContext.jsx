import { createContext, useContext, useEffect, useState } from "react"

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem("campusMarketWishlist")
        return savedWishlist ? JSON.parse(savedWishlist) : []
    })

    useEffect(() => {
        localStorage.setItem(
            "campusMarketWishlist",
            JSON.stringify(wishlist)
        )
    }, [wishlist])

    const isInWishlist = (productId) => {
        return wishlist.some((item) => item.id === productId)
    }

    const addToWishlist = (product) => {
        setWishlist((currentWishlist) => {
            const exists = currentWishlist.some(
                (item) => item.id === product.id
            )

            if (exists) {
                return currentWishlist
            }

            return [...currentWishlist, product]
        })
    }

    const removeFromWishlist = (productId) => {
        setWishlist((currentWishlist) =>
            currentWishlist.filter((item) => item.id !== productId)
        )
    }

    const toggleWishlist = (product) => {
        setWishlist((currentWishlist) => {
            const exists = currentWishlist.some(
                (item) => item.id === product.id
            )

            if (exists) {
                return currentWishlist.filter(
                    (item) => item.id !== product.id
                )
            }

            return [...currentWishlist, product]
        })
    }

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
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