import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)

  const isLoggedIn = localStorage.getItem("campusMarketUser") !== null

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem("campusMarketUser")
    setMenuOpen(false)
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
            <div className="hidden items-center gap-8 md:flex">

              <nav className="flex items-center gap-8">

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

              {/* DESKTOP PROFILE */}
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

              <MobileMenuLink
                to="/profile"
                active={isActive("/profile")}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </MobileMenuLink>

              {!isLoggedIn ? (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 flex items-center justify-center rounded-xl bg-[#c65d45] px-4 py-3 text-sm font-bold text-white"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="mt-3 w-full rounded-xl border border-[#625d55] px-4 py-3 text-sm font-semibold text-[#d4cec5]"
                >
                  Log out
                </button>
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
            to="/sell"
            label="Sell"
            active={isActive("/sell")}
            icon="plus"
          />

          <BottomNavItem
            to="/profile"
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

function BottomNavItem({ to, label, active, icon }) {
  return (
    <Link
      to={to}
      className={`flex min-w-[64px] flex-col items-center justify-center gap-1.5 ${
        active ? "text-[#c65d45]" : "text-[#817b72]"
      }`}
    >
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

      <span className="text-[9px] font-semibold">
        {label}
      </span>
    </Link>
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