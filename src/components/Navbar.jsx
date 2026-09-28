
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)

  // IMPORTANT:
  // Keep login state inside React so Navbar updates immediately.
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("campusMarketUser") !== null
  )

  const { cartCount } = useCart()
  const { wishlist } = useWishlist()

  /*
    Login.jsx and Signup.jsx dispatch this event
    after successful authentication.

    Profile/logout also dispatch it after logout.
  */
  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(
        localStorage.getItem("campusMarketUser") !== null
      )
    }

    window.addEventListener(
      "campusMarketAuthChange",
      updateAuthState
    )

    return () => {
      window.removeEventListener(
        "campusMarketAuthChange",
        updateAuthState
      )
    }
  }, [])

  /*
    Also check when the route changes.
    This keeps the Navbar synchronized if authentication
    changes through another page.
  */
  useEffect(() => {
    setIsLoggedIn(
      localStorage.getItem("campusMarketUser") !== null
    )
  }, [location.pathname])

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem("campusMarketUser")

    setIsLoggedIn(false)
    setMenuOpen(false)

    window.dispatchEvent(
      new Event("campusMarketAuthChange")
    )

    navigate("/")
  }

  return (
    <>
      {/* =====================================================
          DESKTOP + MOBILE TOP HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#49443d] bg-[#302e2a]/95 text-[#f5f1e9] backdrop-blur-md">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <div className="flex h-[68px] items-center justify-between">

            {/* LOGO */}
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="relative flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">

                <div className="absolute h-7 w-7 rotate-45 rounded-[8px] bg-[#c65d45] sm:h-8 sm:w-8" />

                <div className="absolute h-[17px] w-[17px] rotate-45 rounded-[5px] bg-[#302e2a] sm:h-[19px] sm:w-[19px]" />

                <div className="relative h-2 w-2 rounded-full bg-[#f5f1e9] sm:h-2.5 sm:w-2.5" />

              </div>

              <h1 className="text-[16px] font-bold tracking-[-0.03em] sm:text-[17px]">
                Campus Market
                <span className="text-[#e4775e]">.</span>
              </h1>

            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden items-center gap-6 md:flex">

              <nav className="flex items-center gap-7">

                <NavLink
                  to="/"
                  active={isActive("/")}
                >
                  Home
                </NavLink>

                <NavLink
                  to="/marketplace"
                  active={isActive("/marketplace")}
                >
                  Marketplace
                </NavLink>

                <NavLink
                  to="/sell"
                  active={isActive("/sell")}
                >
                  Sell
                </NavLink>

              </nav>

              {/* =================================================
                  LOGGED-IN DESKTOP ACTIONS
              ================================================= */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2">

                  {/* WISHLIST */}
                  <Link
                    to="/wishlist"
                    aria-label="Wishlist"
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition duration-200 ${
                      isActive("/wishlist")
                        ? "border-[#c65d45] bg-[#c65d45]"
                        : "border-[#625d55] bg-[#3a3732] hover:border-[#c65d45] hover:bg-[#c65d45]"
                    }`}
                  >
                    <HeartIcon filled={isActive("/wishlist")} />

                    {wishlist.length > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c65d45] px-1 text-[9px] font-bold text-white">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>

                  {/* CART */}
                  <Link
                    to="/cart"
                    aria-label="Cart"
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition duration-200 ${
                      isActive("/cart")
                        ? "border-[#c65d45] bg-[#c65d45]"
                        : "border-[#625d55] bg-[#3a3732] hover:border-[#c65d45] hover:bg-[#c65d45]"
                    }`}
                  >
                    <CartIcon />

                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c65d45] px-1 text-[9px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* PROFILE */}
                  <Link
                    to="/profile"
                    aria-label="Profile"
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition duration-200 ${
                      isActive("/profile")
                        ? "border-[#c65d45] bg-[#c65d45]"
                        : "border-[#625d55] bg-[#3a3732] hover:border-[#c65d45] hover:bg-[#c65d45]"
                    }`}
                  >
                    <ProfileIcon />
                  </Link>

                </div>
              ) : (

                /* =================================================
                   LOGGED-OUT DESKTOP ACTIONS
                ================================================= */
                <div className="flex items-center gap-3">

                  <Link
                    to="/login"
                    className="text-sm font-medium text-[#c8c2b9] transition hover:text-[#e4775e]"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="rounded-xl bg-[#c65d45] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#b9503a]"
                  >
                    Sign Up
                  </Link>

                </div>
              )}

            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#625d55] bg-[#3a3732] md:hidden"
            >

              {menuOpen ? (
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}

            </button>

          </div>

        </div>

        {/* =================================================
            MOBILE DROPDOWN
        ================================================= */}
        {menuOpen && (
          <div className="border-t border-[#49443d] bg-[#302e2a] px-5 py-4 md:hidden">

            <div className="space-y-1">

              <MobileMenuLink
                to="/"
                active={isActive("/")}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </MobileMenuLink>

              <MobileMenuLink
                to="/marketplace"
                active={isActive("/marketplace")}
                onClick={() => setMenuOpen(false)}
              >
                Marketplace
              </MobileMenuLink>

              <MobileMenuLink
                to="/sell"
                active={isActive("/sell")}
                onClick={() => setMenuOpen(false)}
              >
                Sell
              </MobileMenuLink>

              {/* LOGGED-IN MOBILE OPTIONS */}
              {isLoggedIn ? (
                <>
                  <MobileMenuLink
                    to="/wishlist"
                    active={isActive("/wishlist")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Wishlist

                    {wishlist.length > 0 && (
                      <span className="rounded-full bg-[#c65d45] px-2 py-0.5 text-[10px] text-white">
                        {wishlist.length}
                      </span>
                    )}
                  </MobileMenuLink>

                  <MobileMenuLink
                    to="/cart"
                    active={isActive("/cart")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Cart

                    {cartCount > 0 && (
                      <span className="rounded-full bg-[#c65d45] px-2 py-0.5 text-[10px] text-white">
                        {cartCount}
                      </span>
                    )}
                  </MobileMenuLink>

                  <MobileMenuLink
                    to="/profile"
                    active={isActive("/profile")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </MobileMenuLink>

                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full rounded-xl border border-[#625d55] px-4 py-3 text-sm font-semibold text-[#d4cec5]"
                  >
                    Log out
                  </button>
                </>
              ) : (

                /* LOGGED-OUT MOBILE OPTIONS */
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="mt-3 flex items-center justify-center rounded-xl border border-[#625d55] px-4 py-3 text-sm font-semibold text-[#d4cec5] transition hover:border-[#c65d45] hover:text-[#e4775e]"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-[#c65d45] px-4 py-3 text-sm font-bold text-white"
                  >
                    Sign Up
                  </Link>
                </>
              )}

            </div>

          </div>
        )}

      </header>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#d4cabc] bg-[#faf8f3]/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden">

        <div className="mx-auto flex h-[66px] max-w-md items-center justify-around">

          <BottomNavItem
            to="/"
            label="Home"
            active={isActive("/")}
            icon="home"
          />

          <BottomNavItem
            to="/marketplace"
            label="Browse"
            active={isActive("/marketplace")}
            icon="search"
          />

          <BottomNavItem
            to={isLoggedIn ? "/wishlist" : "/login"}
            label="Saved"
            active={isActive("/wishlist")}
            icon="heart"
            badge={isLoggedIn ? wishlist.length : 0}
          />

          <BottomNavItem
            to="/sell"
            label="Sell"
            active={isActive("/sell")}
            icon="plus"
          />

          <BottomNavItem
            to={isLoggedIn ? "/cart" : "/login"}
            label="Cart"
            active={isActive("/cart")}
            icon="cart"
            badge={isLoggedIn ? cartCount : 0}
          />

          <BottomNavItem
            to={isLoggedIn ? "/profile" : "/login"}
            label="Profile"
            active={isActive("/profile")}
            icon="user"
          />

        </div>

      </nav>
    </>
  )
}

/* =========================================================
   DESKTOP NAV LINK
========================================================= */

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`text-sm transition ${
        active
          ? "font-semibold text-[#e4775e]"
          : "font-medium text-[#c8c2b9] hover:text-[#e4775e]"
      }`}
    >
      {children}
    </Link>
  )
}

/* =========================================================
   MOBILE MENU LINK
========================================================= */

function MobileMenuLink({ to, active, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
        active
          ? "bg-[#433b35] font-semibold text-[#e4775e]"
          : "font-medium text-[#d0c9c0]"
      }`}
    >
      {children}

      {active && (
        <span className="h-1.5 w-1.5 rounded-full bg-[#e4775e]" />
      )}
    </Link>
  )
}

/* =========================================================
   BOTTOM NAV ITEM
========================================================= */

function BottomNavItem({
  to,
  label,
  active,
  icon,
  badge = 0,
}) {
  return (
    <Link
      to={to}
      className={`relative flex min-w-[48px] flex-col items-center justify-center gap-1.5 ${
        active ? "text-[#c65d45]" : "text-[#817b72]"
      }`}
    >

      <div className="relative">

        {icon === "home" && (
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path d="m3 10 9-7 9 7" />
            <path d="M5 9v11h14V9" />
            <path d="M9 20v-6h6v6" />
          </svg>
        )}

        {icon === "search" && (
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        )}

        {icon === "heart" && (
          <HeartIcon filled={active} />
        )}

        {icon === "cart" && (
          <CartIcon />
        )}

        {icon === "plus" && (
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              active
                ? "bg-[#c65d45] text-white"
                : "border border-[#d4cabc] bg-[#f5f1e9]"
            }`}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        )}

        {icon === "user" && <ProfileIcon />}

        {badge > 0 && (
          <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c65d45] px-1 text-[8px] font-bold text-white">
            {badge}
          </span>
        )}

      </div>

      <span className="text-[9px] font-semibold">
        {label}
      </span>

    </Link>
  )
}

/* =========================================================
   HEART ICON
========================================================= */

function HeartIcon({ filled = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
    </svg>
  )
}

/* =========================================================
   CART ICON
========================================================= */

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 5h2l1.5 10h10l2-7H7" />
      <circle cx="10" cy="19" r="1.3" />
      <circle cx="17" cy="19" r="1.3" />
    </svg>
  )
}

/* =========================================================
   PROFILE ICON
========================================================= */

function ProfileIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
      />

      <path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" />
    </svg>
  )
}

export default Navbar


