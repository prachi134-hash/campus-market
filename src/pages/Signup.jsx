import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API_URL from "../lib/api"

function Signup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    course: "",
    year: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")

    if (
      !formData.name ||
      !formData.email ||
      !formData.college ||
      !formData.course ||
      !formData.year ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            college: formData.college,
            course: formData.course,
            year: formData.year,
            password: formData.password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create account."
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

      navigate("/profile", { replace: true })
    } catch (error) {
      console.error("Signup error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-68px)] items-center justify-center overflow-hidden bg-[#f5f1e9] px-5 py-10">

      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.025]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85')",
        }}
      />

      <div className="relative z-10 w-full max-w-lg">

        <div className="mb-7 text-center">

          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#c65d45]">
            Join the campus
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#25231f]">
            Create your account
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#817b72]">
            Create an account to buy and sell within your campus marketplace.
          </p>

        </div>

        <div className="rounded-[24px] border border-[#d4cabc] bg-[#faf8f3] p-6 shadow-[0_18px_60px_rgba(68,52,42,0.08)] sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label
                htmlFor="name"
                className="mb-2 block text-xs font-bold text-[#302e2a]"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
              />

            </div>

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-xs font-bold text-[#302e2a]"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="college@example.com"
                className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
              />

            </div>

            <div>

              <label
                htmlFor="college"
                className="mb-2 block text-xs font-bold text-[#302e2a]"
              >
                College
              </label>

              <input
                id="college"
                name="college"
                type="text"
                value={formData.college}
                onChange={handleChange}
                placeholder="Your college name"
                className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
              />

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <div>

                <label
                  htmlFor="course"
                  className="mb-2 block text-xs font-bold text-[#302e2a]"
                >
                  Course
                </label>

                <input
                  id="course"
                  name="course"
                  type="text"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Computer Engineering"
                  className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
                />

              </div>

              <div>

                <label
                  htmlFor="year"
                  className="mb-2 block text-xs font-bold text-[#302e2a]"
                >
                  Year
                </label>

                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3.5 text-sm text-[#625e57] outline-none transition focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>

              </div>

            </div>

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-xs font-bold text-[#302e2a]"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3.5 pr-16 text-sm outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#817b72]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs font-bold text-[#302e2a]"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter password again"
                className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
              />

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
              {loading ? "Creating account..." : "Create account"}

              {!loading && (
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}

            </button>

          </form>

          <div className="mt-6 text-center">

            <p className="text-xs text-[#817b72]">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-2 inline-block text-xs font-bold text-[#c65d45]"
            >
              Log in →
            </Link>

          </div>

        </div>

      </div>

    </main>
  )
}

export default Signup