import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=1950&q=80",
    caption: "Build your squad. Shape your strategy.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1950&q=80",
    caption: "Every bid matters in the auction arena.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1598514982841-5bde7beecda0?auto=format&fit=crop&w=1950&q=80",
    caption: "Think smart. Bid smarter.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=1950&q=80",
    caption: "Cricket is more than a game. It’s strategy.",
  },
];

export default function Home() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
    setLoaded(true);
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Enthusiast Cricket Club</title>
      </Head>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-gray-100">
        {/* Background Layers */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-white/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl px-10 py-12 shadow-xl max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-wide">
              ENTHUSIAST
              <br />
              CRICKET CLUB
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-gray-700">
              {slides[active].caption}
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

      {/* ABOUT */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Cricket Auctions, Done Right
            </h2>
            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              Enthusiast Cricket Club brings the thrill of cricket auctions to a
              clean, modern platform. Create teams, manage budgets, and make
              strategic bids — all in one place.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=1200&q=80"
            alt="Cricket strategy"
            className="rounded-3xl shadow-lg"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t py-10 px-6 text-center text-gray-600">
        <p className="text-lg font-semibold text-gray-800">
          Enthusiast Cricket Club
        </p>
        <p className="mt-2">Owner: Shubham Patil</p>
        <p>📞 9970907041 | ✉️ skppatil1997@gmail.com</p>
        <p className="mt-4 text-sm text-gray-400">
          © 2025 Enthusiast Cricket Club. All Rights Reserved.
        </p>
      </footer>
    </>
  );
}
