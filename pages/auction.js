import Head from "next/head";

export default function Auction() {
  return (
    <>
      <Head>
        <title>ECC Auction Room</title>
      </Head>

      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Enthusiast Cricket Club · Auction
        </h1>

        <div className="text-sm text-gray-600">
          Logged in as <span className="font-semibold">Admin</span>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="min-h-screen bg-gray-100 grid grid-cols-12 gap-6 p-6">

        {/* LEFT: TEAMS */}
        <section className="col-span-3 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Teams & Purse</h2>

          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span>Mumbai Mavericks</span>
              <span className="font-semibold">₹18,50,000</span>
            </li>
            <li className="flex justify-between">
              <span>Delhi Dynamos</span>
              <span className="font-semibold">₹21,00,000</span>
            </li>
            <li className="flex justify-between">
              <span>Chennai Chargers</span>
              <span className="font-semibold">₹15,75,000</span>
            </li>
            <li className="flex justify-between">
              <span>Pune Panthers</span>
              <span className="font-semibold">₹19,20,000</span>
            </li>
          </ul>
        </section>

        {/* CENTER: PLAYER CARD */}
        <section className="col-span-6 bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Rohit Sharma
          </h2>
          <p className="text-gray-600 mt-1">
            Batsman · Right Hand
          </p>

          <div className="mt-6">
            <p className="text-sm text-gray-500">Base Price</p>
            <p className="text-xl font-semibold">₹2,00,000</p>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">Current Bid</p>
            <p className="text-4xl font-bold text-green-700">
              ₹4,50,000
            </p>
          </div>

          {/* BID CONTROLS (ADMIN) */}
          <div className="mt-10 flex justify-center gap-4">
            <button className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
              + ₹1,00,000
            </button>
            <button className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
              + ₹2,00,000
            </button>
            <button className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
              + ₹5,00,000
            </button>
          </div>

          {/* ADMIN CONTROLS */}
          <div className="mt-8 flex justify-center gap-4">
            <button className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100">
              Next Player
            </button>
            <button className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
              End Auction
            </button>
          </div>
        </section>

        {/* RIGHT: ACTIVITY */}
        <section className="col-span-3 bg-white rounded-xl shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">
            Live Activity
          </h2>

          {/* BIDDING HISTORY */}
          <div className="flex-1 overflow-y-auto text-sm space-y-2 mb-4">
            <p>₹4,50,000 – Mumbai Mavericks</p>
            <p>₹4,00,000 – Delhi Dynamos</p>
            <p>₹3,50,000 – Pune Panthers</p>
          </div>

          {/* CHAT (STATIC) */}
          <div className="border-t pt-3 text-sm">
            <p className="text-gray-600">Live Chat</p>
            <div className="mt-2 space-y-1 text-gray-700">
              <p><strong>Amit:</strong> Big buy 👀</p>
              <p><strong>Ravi:</strong> Worth it</p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
