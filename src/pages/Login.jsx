import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import API_URL from "../lib/api"

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const from = location.state?.from || "/profile"

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")

    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        )
      }

      localStorage.setItem(
        "campusMarketToken",
        data.token
      )

      localStorage.setItem(
        "campusMarketUser",
        JSON.stringify(data.user)
      )

      window.dispatchEvent(
        new Event("campusMarketAuthChange")
      )

      navigate(from, { replace: true })
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-68px)] items-center justify-center overflow-hidden bg-[#f5f1e9] px-5 py-12">

      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.025]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85')",
        }}
      />

      <div className="relative z-10 w-full max-w-md">

        <div className="mb-7 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#302e2a] text-[#f5f1e9]">

            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" />
            </svg>

          </div>

          <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#c65d45]">
            Welcome back
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#25231f]">
            Log in to Campus Market
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#817b72]">
            Sign in to sell items, save products and place orders.
          </p>

        </div>

        <div className="rounded-[24px] border border-[#d4cabc] bg-[#faf8f3] p-6 shadow-[0_18px_60px_rgba(68,52,42,0.08)] sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-xs font-bold text-[#302e2a]"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3.5 text-sm text-[#25231f] outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
              />

            </div>

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="text-xs font-bold text-[#302e2a]"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-[10px] font-semibold text-[#c65d45]"
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3.5 pr-12 text-sm text-[#25231f] outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#817b72]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {error && (
              <div className="rounded-xl border border-[#d7aaa0] bg-[#f5e5e1] px-4 py-3 text-xs font-medium text-[#9d4938]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#c65d45] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#b9503a] hover:shadow-lg hover:shadow-[#c65d45]/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Log in"}

              {!loading && (
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>

          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#ded6ca]" />

            <span className="text-[9px] uppercase tracking-[0.12em] text-[#9a9389]">
              New here?
            </span>

            <span className="h-px flex-1 bg-[#ded6ca]" />
          </div>

          <Link
            to="/signup"
            className="flex w-full items-center justify-center rounded-full border border-[#cfc4b5] bg-[#f5f1e9] px-6 py-3.5 text-xs font-bold text-[#302e2a] transition hover:border-[#c65d45] hover:text-[#c65d45]"
          >
            Create an account
          </Link>

        </div>

        <p className="mt-6 text-center text-[9px] leading-5 text-[#9a9389]">
          Campus Market is built for student-to-student commerce.
        </p>

      </div>

    </main>
  )
}

export default Login