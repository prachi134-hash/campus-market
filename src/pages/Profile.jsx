
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const defaultProfile = {
  name: "Prachi Manwar",
  email: "",
  branch: "Computer Engineering",
  year: "3rd Year",
  college: "Cummins College of Engineering for Women",
  city: "Nagpur",
}

function Profile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(defaultProfile)
  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [editForm, setEditForm] = useState(defaultProfile)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const savedProfile = localStorage.getItem("campusMarketProfile")
    const savedUser = localStorage.getItem("campusMarketUser")

    let userData = {}

    if (savedUser) {
      try {
        userData = JSON.parse(savedUser)
      } catch {
        userData = {}
      }
    }

    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile)

        const loadedProfile = {
          ...defaultProfile,
          ...parsedProfile,
          email: parsedProfile.email || userData.email || "",
        }

        setProfile(loadedProfile)
        setEditForm(loadedProfile)
      } catch {
        const loadedProfile = {
          ...defaultProfile,
          email: userData.email || "",
        }

        setProfile(loadedProfile)
        setEditForm(loadedProfile)
      }
    } else {
      const loadedProfile = {
        ...defaultProfile,
        email: userData.email || "",
      }

      setProfile(loadedProfile)
      setEditForm(loadedProfile)
    }
  }, [])

  const handleEditChange = (e) => {
    const { name, value } = e.target

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()

    const updatedProfile = {
      ...editForm,
      name: editForm.name.trim(),
      branch: editForm.branch.trim(),
      college: editForm.college.trim(),
      city: editForm.city.trim(),
    }

    setProfile(updatedProfile)

    localStorage.setItem(
      "campusMarketProfile",
      JSON.stringify(updatedProfile)
    )

    setEditOpen(false)
  }

  const handlePasswordChange = (e) => {
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
      passwordForm.newPassword !== passwordForm.confirmPassword
    ) {
      alert("New password and confirm password do not match.")
      return
    }

    /*
      Backend authentication will handle the real password change.

      Never store passwords in localStorage.
    */

    alert(
      "Password change will be connected to the backend authentication system."
    )

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    setPasswordOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("campusMarketUser")

    window.dispatchEvent(new Event("campusMarketAuthChange"))

    navigate("/login")
  }

  const handleDeleteAccount = () => {
    /*
      Real account deletion will be handled by the backend.
      For now, this only clears the frontend demo data.
    */

    localStorage.removeItem("campusMarketUser")
    localStorage.removeItem("campusMarketProfile")
    localStorage.removeItem("campusMarketCart")
    localStorage.removeItem("campusMarketWishlist")

    setDeleteOpen(false)

    window.dispatchEvent(new Event("campusMarketAuthChange"))

    navigate("/signup")
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">

        {/* Page Heading */}
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

        {/* Profile Card */}
        <section className="overflow-hidden rounded-2xl border border-[#ddd4c7] bg-[#fffdf8]">

          {/* Profile Identity */}
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#302e2a] text-xl font-semibold text-[#f7f4ee]">
                PM
              </div>

              {/* Name + Academic Info */}
              <div className="min-w-0">
                <h2 className="text-2xl font-semibold tracking-tight text-[#20201e]">
                  {profile.name}
                </h2>

                <p className="mt-1 text-sm font-medium text-[#5f5951]">
                  {profile.branch} · {profile.year}
                </p>

                <p className="mt-1 text-sm text-[#8a8177]">
                  Campus Market member since 2026
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="border-t border-[#e5ddd2] px-6 py-6 sm:px-8">
            <div className="grid gap-6 sm:grid-cols-2">

              {/* Email */}
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#9a9187]">
                  Email
                </p>

                <p className="break-all text-sm font-medium text-[#302e2a]">
                  {profile.email || "Email will appear after account setup"}
                </p>
              </div>

              {/* College */}
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#9a9187]">
                  College
                </p>

                <p className="text-sm font-medium leading-5 text-[#302e2a]">
                  {profile.college}
                </p>
              </div>

              {/* City */}
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#9a9187]">
                  City
                </p>

                <p className="text-sm font-medium text-[#302e2a]">
                  {profile.city}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Main Account Shortcuts */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">

          {/* Orders */}
          <button
            onClick={() => navigate("/orders")}
            className="group rounded-2xl border border-[#ddd4c7] bg-[#fffdf8] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#c65d45]"
          >
            <div className="flex items-start justify-between">

              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1e8dc] text-[#302e2a]">
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

                <h3 className="text-base font-semibold text-[#302e2a]">
                  Your Orders
                </h3>

                <p className="mt-1 text-sm text-[#7d756c]">
                  View your purchases and meetup details
                </p>
              </div>

              <span className="text-lg text-[#9a9187] transition group-hover:translate-x-1 group-hover:text-[#c65d45]">
                →
              </span>

            </div>
          </button>

          {/* Selling Products */}
          <button
            onClick={() => navigate("/my-listings")}
            className="group rounded-2xl border border-[#ddd4c7] bg-[#fffdf8] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#c65d45]"
          >
            <div className="flex items-start justify-between">

              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1e8dc] text-[#302e2a]">
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

                <h3 className="text-base font-semibold text-[#302e2a]">
                  Selling Products
                </h3>

                <p className="mt-1 text-sm text-[#7d756c]">
                  Manage your listed products
                </p>
              </div>

              <span className="text-lg text-[#9a9187] transition group-hover:translate-x-1 group-hover:text-[#c65d45]">
                →
              </span>

            </div>
          </button>

        </section>

        {/* Account Actions */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#ddd4c7] bg-[#fffdf8]">

          {/* Change Password */}
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

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="group flex w-full items-center justify-between border-b border-[#e5ddd2] px-6 py-5 text-left transition hover:bg-[#faf6ef] sm:px-7"
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

          {/* Delete Account */}
          <button
            onClick={() => setDeleteOpen(true)}
            className="group flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-[#faf6ef] sm:px-7"
          >
            <div>
              <p className="text-sm font-semibold text-[#9a4034]">
                Delete Account
              </p>

              <p className="mt-1 text-xs text-[#8a8177]">
                Permanently remove your Campus Market account
              </p>
            </div>

            <span className="text-lg text-[#9a9187] transition group-hover:translate-x-1 group-hover:text-[#9a4034]">
              →
            </span>
          </button>

        </section>

      </div>

      {/* =========================
          EDIT PROFILE MODAL
         ========================= */}
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

              {/* Full Name */}
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

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  disabled
                  placeholder="Email will appear after account setup"
                  className="w-full cursor-not-allowed rounded-lg border border-[#ddd4c7] bg-[#f3eee6] px-3.5 py-2.5 text-sm text-[#8a8177]"
                />

                <p className="mt-1.5 text-xs text-[#9a9187]">
                  Email is linked to your account and cannot be changed here.
                </p>
              </div>

              {/* Branch */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  Branch
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

              {/* Year */}
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

              {/* College */}
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

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4f4942]">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={editForm.city}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-lg border border-[#d9d0c4] bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#302e2a] outline-none transition focus:border-[#c65d45]"
                />
              </div>

              {/* Buttons */}
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

      {/* =========================
          CHANGE PASSWORD MODAL
         ========================= */}
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

      {/* =========================
          DELETE ACCOUNT MODAL
         ========================= */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302e2a]/45 px-5 py-8">
          <div className="w-full max-w-md rounded-2xl border border-[#ddd4c7] bg-[#fffdf8] shadow-xl">

            <div className="px-6 py-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f6e5e1] text-[#9a4034]">
                !
              </div>

              <h2 className="text-lg font-semibold text-[#302e2a]">
                Delete your account?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#716b63]">
                This will remove your current Campus Market account data
                from this browser. The permanent account deletion will be
                handled by the backend once authentication is connected.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="flex-1 rounded-lg border border-[#d2c8bb] px-4 py-2.5 text-sm font-medium text-[#5f5951] hover:bg-[#f5f0e8]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 rounded-lg bg-[#9a4034] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#84352c]"
                >
                  Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </main>
  )
}

export default Profile

