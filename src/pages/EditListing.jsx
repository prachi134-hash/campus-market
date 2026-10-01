import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import API_URL from "../lib/api"

const categories = [
  "Books & Notes",
  "Electronics",
  "Cycles",
  "Furniture",
  "Clothing",
  "Other",
]

const conditions = [
  "Like new",
  "Excellent",
  "Good",
  "Fair",
]

const locations = [
  "Main Gate",
  "Library",
  "Cafeteria",
  "Academic Block",
]

function EditListing() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    description: "",
    location: "",
    image: "",
    status: "AVAILABLE",
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("campusMarketToken")

        if (!token) {
          navigate("/login")
          return
        }

        const response = await fetch(
          `${API_URL}/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch listing"
          )
        }

        setForm({
          title: data.title || "",
          price: data.price ?? "",
          category: data.category || "",
          condition: data.condition || "",
          description: data.description || "",
          location: data.location || "",
          image: data.image || "",
          status: data.status || "AVAILABLE",
        })

        setImagePreview(data.image || null)
      } catch (error) {
        console.error("Fetch listing error:", error)

        setError(
          error.message || "Failed to load listing"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadNewImage = async () => {
    if (!selectedImage) {
      return form.image
    }

    const fileName = `${Date.now()}-${selectedImage.name}`

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, selectedImage)

    if (uploadError) {
      throw uploadError
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName)

    return publicUrlData.publicUrl
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.status !== "AVAILABLE") {
      setError(
        "This listing can no longer be edited because it is not available."
      )
      return
    }

    try {
      setSaving(true)
      setError("")

      const token = localStorage.getItem("campusMarketToken")

      if (!token) {
        navigate("/login")
        return
      }

      const imageUrl = await uploadNewImage()

      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: form.title,
            price: Number(form.price),
            category: form.category,
            condition: form.condition,
            description:
              form.description || "No description provided.",
            location: form.location,
            image: imageUrl,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update listing"
        )
      }

      alert("Listing updated successfully.")

      navigate("/my-listings")
    } catch (error) {
      console.error("Update listing error:", error)

      setError(
        error.message || "Failed to update listing"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (form.status !== "AVAILABLE") {
      setError(
        "This listing cannot be deleted because it is no longer available."
      )
      return
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this listing? This action cannot be undone."
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)
      setError("")

      const token = localStorage.getItem("campusMarketToken")

      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch(
        `${API_URL}/api/products/${id}`,
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
          data.message || "Failed to delete listing"
        )
      }

      alert("Listing deleted successfully.")

      navigate("/my-listings")
    } catch (error) {
      console.error("Delete listing error:", error)

      setError(
        error.message || "Failed to delete listing"
      )
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f1e9]">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
          <p className="text-sm text-[#817b72]">
            Loading listing...
          </p>
        </div>
      </main>
    )
  }

  if (error && !form.title) {
    return (
      <main className="min-h-screen bg-[#f5f1e9]">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">

          <h1 className="text-xl font-bold text-[#302e2a]">
            Unable to load listing
          </h1>

          <p className="mt-2 text-sm text-[#817b72]">
            {error}
          </p>

          <button
            onClick={() => navigate("/my-listings")}
            className="mt-6 rounded-full bg-[#302e2a] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#45413b]"
          >
            Back to My Listings
          </button>

        </div>
      </main>
    )
  }

  const isEditable = form.status === "AVAILABLE"

  return (
    <main className="min-h-screen bg-[#f5f1e9]">

      <section className="border-b border-[#d9d0c3]">

        <div className="mx-auto max-w-3xl px-6 py-10 md:py-12">

          <Link
            to="/my-listings"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#817b72] transition hover:text-[#c65d45]"
          >
            ← Back to My Listings
          </Link>

          <div className="mt-7">

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c65d45]">
              Manage listing
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#25231f] md:text-4xl">
              Edit Listing
            </h1>

            <p className="mt-2 text-sm text-[#625e57]">
              Update the information for your product.
            </p>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#d4cabc] bg-[#faf8f3] p-6 md:p-8"
        >

          {error && (
            <div className="mb-6 rounded-xl border border-[#e1b9ae] bg-[#f8e8e3] px-4 py-3 text-sm text-[#9f4635]">
              {error}
            </div>
          )}

          {!isEditable && (
            <div className="mb-6 rounded-xl border border-[#d4cabc] bg-[#f5f1e9] px-4 py-4">

              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#c65d45]">
                Listing {form.status}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#625e57]">
                This listing can no longer be edited because it is currently{" "}
                {form.status.toLowerCase()}.
              </p>

            </div>
          )}

          <div>

            <label className="text-xs font-bold text-[#302e2a]">
              Product image
            </label>

            <label
              className={`group relative mt-2 flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#c5b9aa] bg-[#f5f1e9] transition ${
                isEditable
                  ? "cursor-pointer hover:border-[#c65d45] hover:bg-[#f1ebe2]"
                  : "cursor-not-allowed opacity-80"
              }`}
            >

              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {isEditable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#25231f]/45 opacity-0 transition group-hover:opacity-100">
                      <span className="rounded-full bg-[#faf8f3] px-4 py-2 text-xs font-bold text-[#302e2a]">
                        Change photo
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="px-6 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d3c7b8] bg-[#faf8f3] text-[#c65d45]">

                    <svg
                      width="23"
                      height="23"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="16"
                        rx="2"
                      />

                      <circle
                        cx="8.5"
                        cy="9"
                        r="1.5"
                      />

                      <path d="m21 15-5-5L5 20" />

                    </svg>

                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#4d4942]">
                    Add a photo
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#8a8379]">
                    JPG, PNG or WEBP
                  </p>

                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={!isEditable}
                className="hidden"
              />

            </label>

            <p className="mt-2 text-[10px] text-[#817b72]">
              {isEditable
                ? "Select a new photo only if you want to replace the current one."
                : "Product images cannot be changed after an order has started."}
            </p>

          </div>

          <div className="mt-6">

            <label
              htmlFor="title"
              className="text-xs font-bold text-[#302e2a]"
            >
              Product title
            </label>

            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              disabled={!isEditable}
              className="mt-2 w-full rounded-xl border border-[#d4cabc] bg-white px-4 py-3 text-sm text-[#302e2a] outline-none transition focus:border-[#c65d45] disabled:cursor-not-allowed disabled:bg-[#eee9e1] disabled:text-[#817b72]"
            />

          </div>

          <div className="mt-5">

            <label
              htmlFor="price"
              className="text-xs font-bold text-[#302e2a]"
            >
              Price
            </label>

            <div className="relative mt-2">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#817b72]">
                ₹
              </span>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
                disabled={!isEditable}
                className="w-full rounded-xl border border-[#d4cabc] bg-white py-3 pl-9 pr-4 text-sm text-[#302e2a] outline-none transition focus:border-[#c65d45] disabled:cursor-not-allowed disabled:bg-[#eee9e1] disabled:text-[#817b72]"
              />

            </div>

          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <div>

              <label
                htmlFor="category"
                className="text-xs font-bold text-[#302e2a]"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                disabled={!isEditable}
                className="mt-2 w-full rounded-xl border border-[#d4cabc] bg-white px-4 py-3 text-sm text-[#302e2a] outline-none transition focus:border-[#c65d45] disabled:cursor-not-allowed disabled:bg-[#eee9e1] disabled:text-[#817b72]"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <label
                htmlFor="condition"
                className="text-xs font-bold text-[#302e2a]"
              >
                Condition
              </label>

              <select
                id="condition"
                name="condition"
                value={form.condition}
                onChange={handleChange}
                required
                disabled={!isEditable}
                className="mt-2 w-full rounded-xl border border-[#d4cabc] bg-white px-4 py-3 text-sm text-[#302e2a] outline-none transition focus:border-[#c65d45] disabled:cursor-not-allowed disabled:bg-[#eee9e1] disabled:text-[#817b72]"
              >
                <option value="">
                  Select condition
                </option>

                {conditions.map((condition) => (
                  <option
                    key={condition}
                    value={condition}
                  >
                    {condition}
                  </option>
                ))}
              </select>

            </div>

          </div>

          <div className="mt-5">

            <label
              htmlFor="description"
              className="text-xs font-bold text-[#302e2a]"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              disabled={!isEditable}
              className="mt-2 w-full resize-none rounded-xl border border-[#d4cabc] bg-white px-4 py-3 text-sm leading-6 text-[#302e2a] outline-none transition focus:border-[#c65d45] disabled:cursor-not-allowed disabled:bg-[#eee9e1] disabled:text-[#817b72]"
            />

          </div>

          <div className="mt-5">

            <label
              htmlFor="location"
              className="text-xs font-bold text-[#302e2a]"
            >
              Meetup location
            </label>

            <select
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              disabled={!isEditable}
              className="mt-2 w-full rounded-xl border border-[#d4cabc] bg-white px-4 py-3 text-sm text-[#302e2a] outline-none transition focus:border-[#c65d45] disabled:cursor-not-allowed disabled:bg-[#eee9e1] disabled:text-[#817b72]"
            >
              <option value="">
                Select location
              </option>

              {locations.map((location) => (
                <option
                  key={location}
                  value={location}
                >
                  {location}
                </option>
              ))}
            </select>

          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/my-listings")}
              className="rounded-full border border-[#d4cabc] px-6 py-3 text-xs font-bold text-[#625e57] transition hover:border-[#302e2a] hover:text-[#302e2a]"
            >
              Back
            </button>

            {isEditable && (
              <button
                type="submit"
                disabled={saving || deleting}
                className="rounded-full bg-[#c65d45] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#b9503a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}

          </div>

          {isEditable && (
            <div className="mt-10 border-t border-[#d9d0c3] pt-8">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c65d45]">
                Danger zone
              </p>

              <h2 className="mt-2 text-sm font-bold text-[#302e2a]">
                Delete this listing
              </h2>

              <p className="mt-1 max-w-lg text-xs leading-5 text-[#817b72]">
                Permanently remove this product from Campus Market.
                This action cannot be undone.
              </p>

              <button
                type="button"
                onClick={handleDelete}
                disabled={saving || deleting}
                className="mt-4 rounded-full border border-[#c65d45] px-5 py-2.5 text-xs font-bold text-[#c65d45] transition hover:bg-[#c65d45] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Listing"}
              </button>

            </div>
          )}

        </form>

      </section>

    </main>
  )
}

export default EditListing