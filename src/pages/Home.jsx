
import ProductCard from "../components/ProductCard"

function Home() {

  const categories = [
    {
      name: "Books & Notes",
      count: "120+ items",
      image:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85",
    },
    {
      name: "Electronics",
      count: "80+ items",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
    },
    {
      name: "Furniture",
      count: "45+ items",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
    },
    {
      name: "Accessories",
      count: "60+ items",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
    },
  ]

  const products = [
    {
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
      title: "Engineering Mathematics Book",
      price: "280",
      category: "Books",
      condition: "Like New",
    },
    {
      image:
        "https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=900&q=85",
      title: "Wireless Keyboard",
      price: "650",
      category: "Electronics",
      condition: "Good",
    },
    {
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85",
      title: "Study Chair",
      price: "900",
      category: "Furniture",
      condition: "Good",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Browse",
      text: "Find something useful from students around you.",
    },
    {
      number: "02",
      title: "Connect",
      text: "Message the seller and ask what you need to know.",
    },
    {
      number: "03",
      title: "Meet",
      text: "Choose a convenient place inside your campus.",
    },
    {
      number: "04",
      title: "Done",
      text: "Pick it up, pay safely and give it a second life.",
    },
  ]

  return (
    <main className="relative overflow-hidden bg-[#f5f1e9]">

      {/* GLOBAL BACKGROUND */}

      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-[0.045]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=2000&q=85')",
        }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#f5f1e9]/85" />


      {/* HERO */}

      <section className="relative overflow-hidden border-b border-[#d9d0c3]">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.13]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f1e9] via-[#f5f1e9]/95 to-[#f5f1e9]/70" />

        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full border border-[#c65d45]/15" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full border border-[#c65d45]/10" />


        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-20">

          <div>

            <div className="mb-6 flex items-center gap-3">

              <span className="h-px w-9 bg-[#c65d45]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#c65d45]">
                Student Life • Campus Edition
              </p>

            </div>


            <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-[#25231f] md:text-7xl">

              Good things
              <br />

              <span className="text-[#c65d45]">
                deserve a second
              </span>

              <br />

              campus life.

            </h1>


            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#625e57]">
              Buy, sell and discover useful things from students
              around your campus. Less waste, better prices,
              and everything a little closer to home.
            </p>


            <div className="mt-7 flex flex-wrap items-center gap-3">

              <button className="rounded-lg bg-[#25231f] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c65d45]">
                Explore Marketplace →
              </button>

              <button className="rounded-lg border border-[#cfc5b8] bg-[#faf8f3]/70 px-6 py-3 text-sm font-semibold text-[#625e57] transition hover:border-[#c65d45] hover:text-[#c65d45]">
                Sell an Item
              </button>

            </div>

          </div>


          {/* HERO COLLAGE */}

          <div className="relative mx-auto w-full max-w-[500px]">

            <div className="relative ml-auto h-[380px] w-[88%] overflow-hidden rounded-[26px] border-[7px] border-[#faf8f3] shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1100&q=85"
                alt="Students together"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#25231f]/45 via-transparent to-transparent" />

            </div>


            <div className="absolute -bottom-4 -left-1 w-44 overflow-hidden rounded-2xl border-[5px] border-[#f5f1e9] shadow-xl">

              <img
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=85"
                alt="Books"
                className="h-36 w-full object-cover"
              />

            </div>


            <div className="absolute -right-2 top-7 rounded-2xl border border-[#d4c9bb] bg-[#faf8f3]/90 px-4 py-3 shadow-lg backdrop-blur">

              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#817b72]">
                Around campus
              </p>

              <p className="mt-1 text-lg font-bold text-[#25231f]">
                Buy. Sell. Repeat.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* CATEGORIES */}

      <section className="relative overflow-hidden py-16">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.055]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1800&q=80')",
          }}
        />

        <div className="absolute inset-0 bg-[#f5f1e9]/80" />

        <div className="relative mx-auto max-w-7xl px-6">

          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <div className="mb-2 flex items-center gap-3">

                <span className="h-px w-7 bg-[#c65d45]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c65d45]">
                  Explore
                </p>

              </div>

              <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#25231f] md:text-4xl">
                Browse Categories
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-[#706a62]">
                From textbooks to tech, discover useful things
                already circulating around campus.
              </p>

            </div>

            <button className="w-fit text-sm font-semibold text-[#c65d45]">
              View everything →
            </button>

          </div>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map((category, index) => (

              <div
                key={category.name}
                className="group overflow-hidden rounded-2xl border border-[#d2c8ba] bg-[#faf8f3] transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5a4438]/10"
              >

                <div className="relative h-48 overflow-hidden">

                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#25231f]/75 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-[#25231f]/40 text-[10px] font-bold text-white backdrop-blur">
                    0{index + 1}
                  </div>

                </div>


                <div className="flex items-center justify-between p-4">

                  <div>

                    <h3 className="text-sm font-semibold text-[#25231f]">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-[11px] text-[#817b72]">
                      {category.count}
                    </p>

                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d7cdbf] text-sm text-[#c65d45] transition group-hover:bg-[#c65d45] group-hover:text-white">
                    ↗
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* FRESH LISTINGS */}

      <section className="relative overflow-hidden border-y border-[#d5cabc] bg-[#ebe5db] py-16">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.055]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1800&q=80')",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6">

          <div className="mb-8 flex items-end justify-between">

            <div>

              <div className="mb-2 flex items-center gap-3">

                <span className="h-px w-7 bg-[#c65d45]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c65d45]">
                  Recently listed
                </p>

              </div>

              <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#25231f] md:text-4xl">
                Fresh Finds
              </h2>

              <p className="mt-2 text-sm text-[#706a62]">
                Things students are passing on right now.
              </p>

            </div>

            <button className="hidden text-sm font-semibold text-[#c65d45] sm:block">
              Browse all →
            </button>

          </div>


          <div className="grid gap-5 md:grid-cols-3">

            {products.map((product) => (
              <ProductCard
                key={product.title}
                {...product}
              />
            ))}

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section className="relative overflow-hidden py-16">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">

            <div className="mb-2 flex items-center justify-center gap-3">

              <span className="h-px w-7 bg-[#c65d45]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c65d45]">
                Simple by design
              </p>

              <span className="h-px w-7 bg-[#c65d45]" />

            </div>

            <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#25231f] md:text-4xl">
              How It Works
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#706a62]">
              Find something, connect with a student and
              make the exchange.
            </p>

          </div>


          <div className="relative">

            <div className="absolute left-[12.5%] right-[12.5%] top-[30px] hidden h-[2px] bg-[#c65d45] lg:block" />

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

              {steps.map((step) => (

                <div
                  key={step.number}
                  className="relative text-center"
                >

                  <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#c65d45] bg-[#f5f1e9] shadow-[0_0_0_7px_#f5f1e9]">

                    <span className="text-sm font-black text-[#c65d45]">
                      {step.number}
                    </span>

                  </div>


                  <h3 className="mt-6 text-lg font-bold text-[#25231f]">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-2 max-w-[220px] text-sm leading-6 text-[#706a62]">
                    {step.text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* SELL AN ITEM */}

      <section className="mx-auto max-w-7xl px-6 pb-16">

        <div className="group relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-[28px] border border-[#4c4841] bg-[#302e2a] shadow-xl">

          {/* BACKGROUND IMAGE */}

          <div
            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=90')",
            }}
          />

          {/* DARK IMAGE OVERLAY */}

          <div className="absolute inset-0 bg-[#25231f]/70" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#25231f]/45 via-[#25231f]/65 to-[#25231f]/80" />


          {/* CENTER CONTENT */}

          <div className="relative z-10 flex max-w-2xl flex-col items-center px-6 py-12 text-center">

            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#e58b75]">
              Give it a second life
            </p>


            <button className="mt-4 flex items-center gap-4 text-4xl font-bold tracking-[-0.05em] text-white transition duration-300 hover:text-[#e4775e] md:text-6xl">

              <span>
                Sell an Item
              </span>

              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 text-lg font-normal transition duration-300 group-hover:border-[#e4775e] group-hover:bg-[#c65d45] md:h-14 md:w-14 md:text-xl">
                ↗
              </span>

            </button>


            <p className="mt-5 max-w-lg text-sm leading-6 text-[#ddd6cc] md:text-[15px]">
              Turn things you no longer need into something
              useful for another student on campus.
            </p>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Home

