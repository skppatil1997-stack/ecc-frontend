{/* HERO */}
<section className="relative min-h-screen overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=1950&q=80')",
    }}
  />

  {/* Light Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-white/90" />

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
    <div className="bg-white/90 backdrop-blur-md rounded-3xl px-12 py-14 shadow-2xl max-w-3xl">
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-wide">
        ENTHUSIAST
        <br />
        CRICKET CLUB
      </h1>

      <p className="mt-6 text-xl md:text-2xl text-gray-700">
        A modern cricket auction experience built on strategy and passion
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-6">
        <button
          onClick={() => router.push("/login")}
          className="px-8 py-3 text-lg font-semibold rounded-full bg-green-700 text-white hover:bg-green-800 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="px-8 py-3 text-lg font-semibold rounded-full border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition"
        >
          Create Account
        </button>
      </div>
    </div>
  </div>
</section>
