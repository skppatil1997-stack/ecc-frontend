import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Enthusiast Cricket Club</title>
      </Head>

      {/* HERO */}
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1593766788306-28561086694c?auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-white/70"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900">
            ENTHUSIAST
            <br />
            CRICKET CLUB
          </h1>

          <p className="mt-6 text-xl md:text-2xl text-gray-700 max-w-2xl">
            Where Strategy Meets the Spirit of Cricket
          </p>

          <div className="mt-10 flex gap-6">
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

      {/* ABOUT */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              What is Enthusiast Cricket Club?
            </h2>
            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              Enthusiast Cricket Club is a modern cricket auction platform
              designed for true lovers of the game. Build teams, bid smartly,
              and experience the excitement of an IPL-style auction inspired by
              the world’s most scenic cricket grounds.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80"
            className="rounded-2xl shadow-lg"
            alt="Cricket Ground"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Experience the Auction
          </h2>

          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {[
              ["Create Teams", "Define budgets and plan your legacy"],
              ["Live Auction", "Random players, real-time bidding"],
              ["Build Champions", "Create the ultimate cricket team"],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition"
              >
                <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
                <p className="mt-4 text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-6 text-center">
        <p className="text-lg font-semibold">Enthusiast Cricket Club</p>
        <p className="mt-2">Owner: Shubham Patil</p>
        <p>📞 9970907041 | ✉️ skppatil1997@gmail.com</p>
        <p className="mt-4 text-sm text-gray-500">
          © 2025 Enthusiast Cricket Club. All Rights Reserved.
        </p>
      </footer>
    </>
  );
}
