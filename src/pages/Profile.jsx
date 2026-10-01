import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API_URL from "../lib/api"

const defaultProfile = {
  name: "",
  email: "",
  branch: "",
  year: "",
  college: "",
}

function Profile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(defaultProfile)
  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  const [editForm, setEditForm] = useState(defaultProfile)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("campusMarketToken")

      if (!token) {
        navigate("/login", { replace: true })
        return
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch profile"
          )
        }

        const savedUser = localStorage.getItem(
          "campusMarketUser"
        )

        let savedUserData = {}

        if (savedUser) {
          try {
            savedUserData = JSON.parse(savedUser)
          } catch {
            savedUserData = {}
          }
        }

        const loadedProfile = {
          name: data.name || "",
          email: data.email || "",
          branch: data.course || "",
          year: data.year || "",
          college: data.college || "",
        }

        setProfile(loadedProfile)
        setEditForm(loadedProfile)

        localStorage.setItem(
          "campusMarketUser",
          JSON.stringify({
            ...savedUserData,
            id: data.id,
            name: data.name,
            email: data.email,
            college: data.college,
            course: data.course,
            year: data.year,
          })
        )
      } catch (error) {
        console.error("Failed to load profile:", error)

        if (
          error.message.includes("Authentication") ||
          error.message.includes("token") ||
          error.message.includes("expired") ||
          error.message.includes("Invalid")
        ) {
          localStorage.removeItem("campusMarketUser")
          localStorage.removeItem("campusMarketToken")

          navigate("/login", { replace: true })
          return
        }

        alert(error.message || "Unable to load profile.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleEditChange = (e) => {
    const { name, value } = e.target

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("campusMarketToken")

    if (!token) {
      navigate("/login")
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editForm.name.trim(),
            course: editForm.branch.trim(),
            year: editForm.year,
            college: editForm.college.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        )
      }

      const updatedProfile = {
        ...editForm,
        name: data.user.name,
        email: data.user.email,
        branch: data.user.course,
        year: data.user.year,
        college: data.user.college,
      }

      setProfile(updatedProfile)
      setEditForm(updatedProfile)

      const savedUser = localStorage.getItem(
        "campusMarketUser"
      )

      let userData = {}

      if (savedUser) {
        try {
          userData = JSON.parse(savedUser)
        } catch {
          userData = {}
        }
      }

      const updatedUser = {
        ...userData,
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        course: data.user.course,
        year: data.user.year,
        college: data.user.college,
      }

      localStorage.setItem(
        "campusMarketUser",
        JSON.stringify(updatedUser)
      )

      setEditOpen(false)

      window.dispatchEvent(
        new Event("campusMarketAuthChange")
      )

      alert("Profile updated successfully.")
    } catch (error) {
      console.error("Failed to save profile:", error)

      alert(error.message || "Unable to save profile.")
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      alert("Please fill in all password fields.")
      return
    }

    if (passwordForm.newPassword.length < 8) {
      alert("New password must be at least 8 characters.")
      return
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      alert("New password and confirm password do not match.")
      return
    }

    const token = localStorage.getItem("campusMarketToken")

    if (!token) {
      navigate("/login")
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword:
              passwordForm.currentPassword,
            newPassword:
              passwordForm.newPassword,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to change password"
        )
      }

      alert("Password changed successfully.")

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setPasswordOpen(false)
    } catch (error) {
      console.error("Password change error:", error)

      alert(
        error.message ||
          "Unable to change password."
      )
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("campusMarketUser")
    localStorage.removeItem("campusMarketToken")

    window.dispatchEvent(
      new Event("campusMarketAuthChange")
    )

    navigate("/login")
  }

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U"

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-[#716b63]">
            Loading profile...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 sm:px-8 lg:px-10">

      <div className="mx-auto max-w-5xl">

        <div className="mb-7 flex items-center justify-between">

          <div>

            <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-[#8a8177]">
              Account
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-[#302e2a] sm:text-3xl">
              My Profile
            </h1>

          </div>

          <button
            onClick={() => {
              setEditForm(profile)
              setEditOpen(true)
            }}
            className="rounded-lg border border-[#cfc5b8] bg-[#fffdf8] px-4 py-2.5 text-sm font-medium text-[#302e2a] transition hover:border-[#c65d45] hover:text-[#c65d45]"
          >
            Edit Profile
          </button>

        </div>

        <section className="overflow-hidden rounded-2xl border border-[#ddd4c7] bg-[#fffdf8]">

          <div className="px-6 py-7 sm:px-8 sm:py-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#302e2a] text-xl font-semibold text-[#f7f4ee]">
                {initials}
              </div>

              <div className="min-w-0">

                <h2 className="text-2xl font-semibold tracking-tight text-[#20201e]">
                  {profile.name || "Campus Market User"}
                </h2>

                <p className="mt-1 text-sm font-medium text-[#5f5951]">
                  {profile.branch || "Course"} ·{" "}
                  {profile.year || "Year"}
                </p>

                <p className="mt-1 text-sm text-[#8a8177]">
                  Campus Market member since 2026
                </p>

              </div>

            </div>

          </div>

          <div className="border-t border-[#e5ddd2] px-6 py-6 sm:px-8">

            <div className="grid gap-6 sm:grid-cols-2">

              <div>

                <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#9a9187]">
                  Email
                </p>

                <p className="break-all text-sm font-medium text-[#302e2a]">
                  {profile.email || "Email unavailable"}
                </p>

              </div>

              <div>

                <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#9a9187]">
                  College
                </p>

                <p className="text-sm font-medium leading-5 text-[#302e2a]">
                  {profile.college || "College unavailable"}
                </p>

              </div>

            </div>

          </div>

        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">

          <button
            onClick={() => navigate("/orders")}
            className="group rounded-2xl border border-[#ddd4c7] bg-[#fffdf8] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#c65d45]"
          >

            <div className="flex h-full flex-col">

              <div className="flex items-start justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1e8dc] text-[#302e2a]">

                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 3h12v18H6z"
                    />

                    <path
                      strokeLinecap="round"
                      d="M9 7h6M9 11h6M9 15h4"
                    />

                  </svg>

                </div>

                <span className="text-lg text-[#9a9187] transition group-hover:translate-x-1 group-hover:text-[#c65d45]">
                  →
                </span>

              </div>

              <h3 className="mt-5 text-base font-semibold text-[#302e2a]">
                Your Orders
              </h3>

              <p className="mt-1 text-sm leading-5 text-[#7d756c]">
                View your purchases and meetup details
              </p>

            </div>

          </button>

          <button
            onClick={() => navigate("/my-listings")}
            className="group rounded-2xl border border-[#ddd4c7] bg-[#fffdf8] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#c65d45]"
          >

            <div className="flex h-full flex-col">

              <div className="flex items-start justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1e8dc] text-[#302e2a]">

                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7h16v13H4z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V5h8v2M9 12h6M9 16h4"
                    />

                  </svg>

                </div>

                <span className="text-lg text-[#9a9187] transition group-hover:translate-x-1 group-hover:text-[#c65d45]">
                  →
                </span>

              </div>

              <h3 className="mt-5 text-base font-semibold text-[#302e2a]">
                Selling Products
              </h3>

              <p className="mt-1 text-sm leading-5 text-[#7d756c]">
                Manage your listed products
              </p>

            </div>

          </button>

          <button
            onClick={() => navigate("/seller-orders")}
            className="group rounded-2xl border border-[#ddd4c7] bg-[#fffdf8] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#c65d45]"
          >

            <div className="flex h-full flex-col">

              <div className="flex items-start justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1e8dc] text-[#302e2a]">

                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16v12H4z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h8M8 14h5"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 6V4h8v2"
                    />

                  </svg>

                </div>

                <span className="text-lg text-[#9a9187] transition group-hover:translate-x-1 group-hover:text-[#c65d45]">
                  →
                </span>

              </div>

              <h3 className="mt-5 text-base font-semibold text-[#302e2a]">
                My Sales
              </h3>

              <p className="mt-1 text-sm leading-5 text-[#7d756c]">
                View orders placed for your products
              </p>

            </div>

          </button>

        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#ddd4c7] bg-[#fffdf8]">

          <button
            onClick={() => setPasswordOpen(true)}
            className="group flex w-full items-center justify-between border-b border-[#e5ddd2] px-6 py-5 text-left transition hover:bg-[#faf6ef] sm:px-7"
          >

            <div>

              <p className="text-sm font-semibold text-[#302e2a]">
                Change Password
              </p>

              <p className="mt-1 text-xs text-[#8a8177]">
                Update your account password
              </p>

            </div>

            <span className="text-lg text-[#9a9187] transition group-hover:translate-x-1 group-hover:text-[#c65d45]">
              →
            </span>

          </button>

          <button
            onClick={handleLogout}
            className="group flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-[#faf6ef] sm:px-7"
          >

            <div>

              <p className="text-sm font-semibold text-[#302e2a]">
                Logout
              </p>

              <p className="mt-1 text-xs text-[#8a8177]">
                Sign out of your Campus Market account
              </p>

            </div>

            <span className="text-lg text-[#9a9187] transition group-hover:translate-x-1 group-hover:text-[#c65d45]">
              →
            </span>

          </button>

        </section>

      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302e2a]/45 px-5 py-8">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#ddd4c7] bg-[#fffdf8] shadow-xl">

            <div className="flex items-center justify-between border-b border-[#e5ddd2] px-6 py-5">

              <div>

                <h2 className="text-lg font-semibold text-[#302e2a]">
                  Edit Profile
                </h2>

                <p className="mt-1 text-xs text-[#8a8177]">
                  Update your profile information
                </p>

              </div>

              <button
                onClick={() => setEditOpen(false)}
                className="text-xl text-[#8a8177] hover:text-[#302e2a]"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSaveProfile}
              className="space-y-5 px-6 py-6"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-lg border border-[#d9d0c4] bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#302e2a] outline-none transition focus:border-[#c65d45]"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-[#ddd4c7] bg-[#f3eee6] px-3.5 py-2.5 text-sm text-[#8a8177]"
                />

                <p className="mt-1.5 text-xs text-[#9a9187]">
                  Email is linked to your account and cannot be changed here.
                </p>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  Branch / Course
                </label>

                <input
                  type="text"
                  name="branch"
                  value={editForm.branch}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-lg border border-[#d9d0c4] bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#302e2a] outline-none transition focus:border-[#c65d45]"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  Year
                </label>

                <select
                  name="year"
                  value={editForm.year}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-[#d9d0c4] bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#302e2a] outline-none transition focus:border-[#c65d45]"
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  College
                </label>

                <input
                  type="text"
                  name="college"
                  value={editForm.college}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-lg border border-[#d9d0c4] bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#302e2a] outline-none transition focus:border-[#c65d45]"
                />

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex-1 rounded-lg border border-[#d2c8bb] px-4 py-2.5 text-sm font-medium text-[#5f5951] transition hover:bg-[#f5f0e8]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#302e2a] px-4 py-2.5 text-sm font-medium text-[#fffdf8] transition hover:bg-[#403c36]"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {passwordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302e2a]/45 px-5 py-8">

          <div className="w-full max-w-md rounded-2xl border border-[#ddd4c7] bg-[#fffdf8] shadow-xl">

            <div className="flex items-center justify-between border-b border-[#e5ddd2] px-6 py-5">

              <div>

                <h2 className="text-lg font-semibold text-[#302e2a]">
                  Change Password
                </h2>

                <p className="mt-1 text-xs text-[#8a8177]">
                  Keep your account secure
                </p>

              </div>

              <button
                onClick={() => setPasswordOpen(false)}
                className="text-xl text-[#8a8177] hover:text-[#302e2a]"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handlePasswordChange}
              className="space-y-5 px-6 py-6"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  Current Password
                </label>

                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-[#d9d0c4] bg-[#fffdf8] px-3.5 py-2.5 text-sm outline-none focus:border-[#c65d45]"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  New Password
                </label>

                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-[#d9d0c4] bg-[#fffdf8] px-3.5 py-2.5 text-sm outline-none focus:border-[#c65d45]"
                />

                <p className="mt-1.5 text-xs text-[#9a9187]">
                  Minimum 8 characters
                </p>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-[#d9d0c4] bg-[#fffdf8] px-3.5 py-2.5 text-sm outline-none focus:border-[#c65d45]"
                />

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setPasswordOpen(false)}
                  className="flex-1 rounded-lg border border-[#d2c8bb] px-4 py-2.5 text-sm font-medium text-[#5f5951] hover:bg-[#f5f0e8]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#302e2a] px-4 py-2.5 text-sm font-medium text-[#fffdf8] hover:bg-[#403c36]"
                >
                  Update Password
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </main>
  )
}

export default Profile