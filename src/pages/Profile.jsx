import { useState } from "react"
import { Link } from "react-router-dom"

const myListings = [
  {
    id: 1,
    title: "Engineering Mathematics — Vol. 2",
    price: 450,
    category: "Books & Notes",
    condition: "Good",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Scientific Calculator",
    price: 850,
    category: "Electronics",
    condition: "Excellent",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "Java Programming Notes",
    price: 250,
    category: "Books & Notes",
    condition: "Good",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85",
  },
]

const savedItems = [
  {
    id: 4,
    title: "Mechanical Keyboard",
    price: 2200,
    category: "Electronics",
    condition: "Excellent",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    title: "College Backpack",
    price: 700,
    category: "Other",
    condition: "Excellent",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    title: "Desk Lamp",
    price: 650,
    category: "Furniture",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
  },
]

function Profile() {
  const [activeMenu, setActiveMenu] = useState(null)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f1e9]">

      {/* Global Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-[0.018]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85')",
        }}
      />

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}
      <section className="relative z-10 border-b border-[#d9d0c3]">

        <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">

          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-5">

              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#302e2a] text-2xl font-bold text-[#f5f1e9] shadow-sm">
                PM
              </div>

              <div>

                <div className="flex items-center gap-3">
                  <span className="h-px w-7 bg-[#c65d45]" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#c65d45]">
                    My Profile
                  </p>
                </div>

                <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#25231f] md:text-4xl">
                  Prachi Manwar
                </h1>

                <p className="mt-1 text-sm text-[#625e57]">
                  Computer Engineering · 3rd Year
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#817b72]">
                  Campus Market member since 2026
                </p>

              </div>

            </div>

            <button className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cfc4b5] bg-[#faf8f3] px-5 py-2.5 text-xs font-bold text-[#302e2a] transition hover:border-[#c65d45] hover:text-[#c65d45]">

              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
              </svg>

              Edit Profile

            </button>

          </div>

        </div>
      </section>

      {/* =====================================================
          PROFILE ACTIVITY
      ===================================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-8">

        <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[#d4cabc] bg-[#faf8f3]">

          <ActivityItem
            value="3"
            label="Listings"
          />

          <ActivityItem
            value="1"
            label="Sold"
          />

          <ActivityItem
            value="3"
            label="Saved"
          />

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">

        {/* ===================================================
            MY LISTINGS
        =================================================== */}
        <section>

          <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#d8cfc2] pb-5">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c65d45]">
                Your marketplace activity
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#25231f]">
                My Listings
              </h2>

              <p className="mt-1 text-xs text-[#817b72]">
                Items you're currently offering to other students.
              </p>
            </div>

            <Link
              to="/sell"
              className="group hidden items-center gap-2 rounded-full bg-[#c65d45] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#b9503a] sm:inline-flex"
            >
              <span className="text-base leading-none">+</span>
              Sell an item
            </Link>

          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {myListings.map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />
            ))}

          </div>

          <div className="mt-5 sm:hidden">
            <Link
              to="/sell"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c65d45] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#b9503a]"
            >
              <span className="text-base leading-none">+</span>
              Sell an item
            </Link>
          </div>

        </section>

        {/* ===================================================
            SAVED ITEMS
        =================================================== */}
        <section className="mt-14">

          <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#d8cfc2] pb-5">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c65d45]">
                Things you've bookmarked
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#25231f]">
                Saved Items
              </h2>

              <p className="mt-1 text-xs text-[#817b72]">
                Items you may want to come back to.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="hidden text-xs font-bold text-[#c65d45] transition hover:translate-x-1 sm:block"
            >
              Browse marketplace →
            </Link>

          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {savedItems.map((item) => (
              <SavedCard
                key={item.id}
                item={item}
              />
            ))}

          </div>

          <div className="mt-5 text-center sm:hidden">
            <Link
              to="/marketplace"
              className="text-xs font-bold text-[#c65d45]"
            >
              Browse marketplace →
            </Link>
          </div>

        </section>

        {/* ===================================================
            ACCOUNT
        =================================================== */}
        <section className="mt-14">

          <div className="border-b border-[#d8cfc2] pb-5">

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c65d45]">
              Account
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#25231f]">
              Settings & Information
            </h2>

          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-[#d4cabc] bg-[#faf8f3]">

            <AccountRow
              title="Profile information"
              description="Update your name, course and personal details."
              icon="user"
            />

            <AccountRow
              title="Campus information"
              description="Manage your college and campus details."
              icon="campus"
            />

            <AccountRow
              title="Privacy & security"
              description="Control your account and privacy preferences."
              icon="lock"
              last
            />

          </div>

        </section>

        {/* Bottom Note */}
        <div className="mt-12 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#817b72]">

          <span className="h-px w-8 bg-[#c65d45]" />

          <span>Buy less</span>

          <span className="text-[#c65d45]">·</span>

          <span>Share more</span>

          <span className="text-[#c65d45]">·</span>

          <span>Keep it on campus</span>

        </div>

      </section>

    </main>
  )
}

/* =========================================================
   ACTIVITY ITEM
========================================================= */

function ActivityItem({ value, label }) {
  return (
    <div className="border-r border-[#d8cfc2] px-5 py-5 text-center last:border-r-0 sm:py-6">

      <p className="text-xl font-bold tracking-[-0.03em] text-[#25231f] sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#817b72]">
        {label}
      </p>

    </div>
  )
}

/* =========================================================
   MY LISTING CARD
========================================================= */

function ListingCard({ item, activeMenu, setActiveMenu }) {
  const isOpen = activeMenu === item.id

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#d4cabc] bg-[#faf8f3] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(68,52,42,0.09)]">

      <div className="relative h-52 overflow-hidden bg-[#e5ded3]">

        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute left-4 top-4 rounded-full bg-[#faf8f3]/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#625e57] backdrop-blur">
          {item.condition}
        </div>

        <div className="absolute right-4 top-4 rounded-full bg-[#302e2a]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#f5f1e9] backdrop-blur">
          {item.status}
        </div>

      </div>

      <div className="p-5">

        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#c65d45]">
          {item.category}
        </p>

        <h3 className="mt-2 min-h-[40px] text-sm font-bold leading-5 tracking-[-0.02em] text-[#25231f]">
          {item.title}
        </h3>

        <div className="relative mt-5 flex items-center justify-between">

          <p className="text-lg font-bold tracking-[-0.025em] text-[#25231f]">
            ₹{item.price.toLocaleString("en-IN")}
          </p>

          <button
            onClick={() =>
              setActiveMenu(isOpen ? null : item.id)
            }
            aria-label="Listing options"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d5cbbd] text-[#706a62] transition hover:border-[#c65d45] hover:text-[#c65d45]"
          >
            <span className="flex gap-0.5">
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
            </span>
          </button>

          {isOpen && (
            <div className="absolute bottom-10 right-0 z-20 w-36 overflow-hidden rounded-xl border border-[#d4cabc] bg-[#faf8f3] shadow-xl">

              <button className="block w-full px-4 py-3 text-left text-xs font-semibold text-[#625e57] hover:bg-[#eee8dd] hover:text-[#25231f]">
                Edit listing
              </button>

              <button className="block w-full border-t border-[#e1d9ce] px-4 py-3 text-left text-xs font-semibold text-[#625e57] hover:bg-[#eee8dd] hover:text-[#25231f]">
                Mark as sold
              </button>

              <button className="block w-full border-t border-[#e1d9ce] px-4 py-3 text-left text-xs font-semibold text-[#c65d45] hover:bg-[#f2e4df]">
                Remove listing
              </button>

            </div>
          )}

        </div>

      </div>

    </article>
  )
}

/* =========================================================
   SAVED CARD
========================================================= */

function SavedCard({ item }) {
  const [saved, setSaved] = useState(true)

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#d4cabc] bg-[#faf8f3] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(68,52,42,0.09)]">

      <div className="relative h-52 overflow-hidden bg-[#e5ded3]">

        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute left-4 top-4 rounded-full bg-[#faf8f3]/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#625e57] backdrop-blur">
          {item.condition}
        </div>

        <button
          onClick={() => setSaved(!saved)}
          aria-label="Remove saved item"
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${
            saved
              ? "bg-[#c65d45] text-white"
              : "bg-[#faf8f3]/95 text-[#625e57]"
          }`}
        >

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path d="M20.8 8.7c0 5.5-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.8 2.4Z" />
          </svg>

        </button>

      </div>

      <div className="p-5">

        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#c65d45]">
          {item.category}
        </p>

        <h3 className="mt-2 min-h-[40px] text-sm font-bold leading-5 tracking-[-0.02em] text-[#25231f]">
          {item.title}
        </h3>

        <div className="mt-5 flex items-center justify-between">

          <p className="text-lg font-bold tracking-[-0.025em] text-[#25231f]">
            ₹{item.price.toLocaleString("en-IN")}
          </p>

          <button className="text-xs font-bold text-[#c65d45] transition group-hover:translate-x-1">
            View →
          </button>

        </div>

      </div>

    </article>
  )
}

/* =========================================================
   ACCOUNT ROW
========================================================= */

function AccountRow({ title, description, icon, last }) {
  return (
    <button
      className={`group flex w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-[#f1ece4] sm:px-6 ${
        !last ? "border-b border-[#ded6ca]" : ""
      }`}
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d5cbbd] bg-[#f5f1e9] text-[#c65d45]">

        {icon === "user" && (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" />
          </svg>
        )}

        {icon === "campus" && (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path d="m3 10 9-6 9 6" />
            <path d="M5 10v9h14v-9" />
            <path d="M9 19v-6h6v6" />
          </svg>
        )}

        {icon === "lock" && (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        )}

      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-bold text-[#302e2a]">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#817b72]">
          {description}
        </p>

      </div>

      <span className="text-lg text-[#9a9389] transition group-hover:translate-x-1 group-hover:text-[#c65d45]">
        →
      </span>

    </button>
  )
}

export default Profile