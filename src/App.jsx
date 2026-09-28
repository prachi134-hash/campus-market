import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"

import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"

import Home from "./pages/Home"
import Sell from "./pages/Sell"
import Marketplace from "./pages/Marketplace"
import ProductDetails from "./pages/ProductDetails"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Cart from "./pages/Cart"
import Wishlist from "./pages/Wishlist"
import Orders from "./pages/Orders"
import MyListings from "./pages/MyListings"

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/marketplace"
              element={<Marketplace />}
            />

            <Route
              path="/product/:id"
              element={<ProductDetails />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <Sell />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />

          </Routes>

          <Footer />

        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App


