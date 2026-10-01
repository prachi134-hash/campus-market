import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import API_URL from "../lib/api"

function Sell() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    condition: "",
    description: "",
    location: "",
  })

  const [imagePreview, setImagePreview] = useState(null)

  const meetupLocations = [
    "Main Gate",
    "Library",
    "Cafeteria",
    "Academic Block",
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("campusMarketToken")

      if (!token) {
        alert("Please log in before listing an item.")
        return
      }

      const fileInput = document.querySelector(
        'input[type="file"]'
      )

      const file = fileInput?.files?.[0]

      if (!file) {
        alert("Please select an image.")
        return
      }

      const fileName = `${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName)

      const imageUrl = publicUrlData.publicUrl

      const response = await fetch(
        `${API_URL}/api/products`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: formData.title,

            price: Number(formData.price),

            category:
              formData.category === "books"
                ? "Books & Notes"
                : formData.category === "electronics"
                ? "Electronics"
                : formData.category === "cycles"
                ? "Cycles"
                : formData.category === "furniture"
                ? "Furniture"
                : formData.category === "clothing"
                ? "Clothing"
                : "Other",

            condition:
              formData.condition === "like-new"
                ? "Like new"
                : formData.condition.charAt(0).toUpperCase() +
                  formData.condition.slice(1),

            description:
              formData.description || "No description provided.",

            location: formData.location,

            image: imageUrl,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create listing"
        )
      }

      console.log("Product created:", data)

      alert("Item listed successfully!")

      setFormData({
        title: "",
        category: "",
        price: "",
        condition: "",
        description: "",
        location: "",
      })

      setImagePreview(null)

      fileInput.value = ""
    } catch (error) {
      console.error("Create listing error:", error)

      alert(
        error.message ||
          "Unable to list item. Please try again."
      )
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f1e9]">

      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-[0.025]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85')",
        }}
      />

      <section className="relative overflow-hidden border-b border-[#d9d0c3]">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.065]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f1e9] via-[#f5f1e9]/95 to-[#f5f1e9]/80" />

        <div className="relative mx-auto max-w-7xl px-6 py-9 md:py-11">

          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#c65d45]" />

            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#c65d45]">
              Campus Marketplace
            </p>
          </div>

          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.045em] text-[#25231f] md:text-4xl">
            Give something a second life.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#625e57]">
            List something you no longer need and help another student find it
            right here on campus.
          </p>

        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:py-16">

        <div className="overflow-hidden rounded-[28px] border border-[#d4cabc] bg-[#faf8f3] shadow-[0_18px_60px_rgba(68,52,42,0.07)]">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

            <div className="border-b border-[#d8cfc2] bg-[#eee8dd] p-6 md:p-8 lg:border-b-0 lg:border-r">

              <div className="flex h-full flex-col">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c65d45]">
                    Item photos
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#25231f]">
                    Show it well.
                  </h2>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-[#706a62]">
                    Add a clear photo so other students know exactly what
                    you're offering.
                  </p>
                </div>

                <label className="group relative mt-7 flex min-h-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#c5b9aa] bg-[#f5f1e9] transition duration-300 hover:border-[#c65d45] hover:bg-[#f1ebe2]">

                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Item preview"
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-[#25231f]/45 opacity-0 transition group-hover:opacity-100">
                        <span className="rounded-full bg-[#faf8f3] px-4 py-2 text-xs font-bold text-[#302e2a]">
                          Change photo
                        </span>
                      </div>
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

                      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#c65d45]">
                        Browse files
                      </p>

                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

                <div className="mt-auto hidden pt-8 lg:block">

                  <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#817b72]">
                    <span className="h-px w-7 bg-[#c65d45]" />
                    <span>Clear photos sell better</span>
                  </div>

                </div>

              </div>

            </div>

            <div className="p-6 md:p-8 lg:p-10">

              <div className="border-b border-[#ded6ca] pb-6">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c65d45]">
                  New listing
                </p>

                <div className="mt-2 flex items-end justify-between gap-4">

                  <div>
                    <h2 className="text-2xl font-bold tracking-[-0.035em] text-[#25231f]">
                      List your item
                    </h2>

                    <p className="mt-1 text-xs text-[#817b72]">
                      Add the details students need to know.
                    </p>
                  </div>

                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d5cbbd] text-[#c65d45] sm:flex">
                    <span className="text-lg">+</span>
                  </div>

                </div>

              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                <div>

                  <label
                    htmlFor="title"
                    className="mb-2 block text-xs font-bold text-[#302e2a]"
                  >
                    Item title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Engineering Mathematics textbook"
                    className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3 text-sm text-[#25231f] outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
                    required
                  />

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="category"
                      className="mb-2 block text-xs font-bold text-[#302e2a]"
                    >
                      Category
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3 text-sm text-[#625e57] outline-none transition focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="books">Books & Notes</option>
                      <option value="electronics">Electronics</option>
                      <option value="cycles">Cycles</option>
                      <option value="furniture">Furniture</option>
                      <option value="clothing">Clothing</option>
                      <option value="other">Other</option>
                    </select>

                  </div>

                  <div>

                    <label
                      htmlFor="price"
                      className="mb-2 block text-xs font-bold text-[#302e2a]"
                    >
                      Price
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#817b72]">
                        ₹
                      </span>

                      <input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] py-3 pl-8 pr-4 text-sm text-[#25231f] outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
                        required
                      />

                    </div>

                  </div>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="condition"
                      className="mb-2 block text-xs font-bold text-[#302e2a]"
                    >
                      Condition
                    </label>

                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3 text-sm text-[#625e57] outline-none transition focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
                      required
                    >
                      <option value="">Select condition</option>
                      <option value="like-new">Like new</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>

                  </div>

                  <div>

                    <label
                      htmlFor="location"
                      className="mb-2 block text-xs font-bold text-[#302e2a]"
                    >
                      Meetup location
                    </label>

                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3 text-sm text-[#625e57] outline-none transition focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
                      required
                    >
                      <option value="">Select meetup location</option>

                      {meetupLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}

                    </select>

                  </div>

                </div>

                <div className="rounded-xl border border-[#ddd4c7] bg-[#f5f1e9] px-4 py-3.5">

                  <div className="flex items-start gap-3">

                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1e4dc] text-[#c65d45]">
                      ⌖
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#302e2a]">
                        Campus Meetup
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-[#817b72]">
                        Buyers can meet you at the selected campus location
                        after placing an order.
                      </p>
                    </div>

                  </div>

                </div>

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="description"
                      className="block text-xs font-bold text-[#302e2a]"
                    >
                      Description
                    </label>

                    <span className="text-[10px] text-[#9a9389]">
                      Optional
                    </span>

                  </div>

                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Mention useful details such as usage, age, reason for selling, or anything a buyer should know."
                    className="w-full resize-none rounded-xl border border-[#d5cbbd] bg-[#f8f5ee] px-4 py-3 text-sm leading-6 text-[#25231f] outline-none transition placeholder:text-[#a39c92] focus:border-[#c65d45] focus:ring-2 focus:ring-[#c65d45]/10"
                  />

                </div>

                <div className="flex flex-col gap-4 border-t border-[#ded6ca] pt-6 sm:flex-row sm:items-center sm:justify-between">

                  <p className="max-w-xs text-[10px] leading-5 text-[#817b72]">
                    Your listing will be visible to students on the campus
                    marketplace.
                  </p>

                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#c65d45] px-7 py-3.5 text-xs font-bold text-white transition duration-200 hover:bg-[#b9503a] hover:shadow-lg hover:shadow-[#c65d45]/20"
                  >
                    List Item

                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-12">

        <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#817b72]">
          <span className="h-px w-8 bg-[#c65d45]" />
          <span>Keep it useful</span>
          <span className="text-[#c65d45]">·</span>
          <span>Keep it on campus</span>
        </div>

      </div>

    </main>
  )
}

export default Sell