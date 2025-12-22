import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

let socket;

export default function Auction() {
  const router = useRouter();

  const [auction, setAuction] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role"));

    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (data) => {
      setAuction(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 🚀 Admin starts auction
  const startAuction = () => {
    if (!playerName || !basePrice) {
      alert("Player name and base price required");
      return;
    }

    socket.emit("auction:start", {
      player: { name: playerName },
      basePrice: Number(basePrice)
    });

    setPlayerName("");
    setBasePrice("");
  };

  // ⛔ Admin stops auction
  const stopAuction = () => {
    socket.emit("auction:stop");
  };

  // 💰 Bid
  const placeBid = (amount) => {
    socket.emit("auction:bid", {
      bidder: localStorage.getItem("name"),
      amount
    });
  };

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Connecting to auction...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">

      {/* 🔙 Back */}
      <button
        onClick={() => router.push("/")}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-extrabold mb-6 text-blue-900">
        Live Auction
      </h1>

      {/* Auction Status */}
      <div className="bg-white p-6 rounded-xl shadow mb-6 max-w-xl">
        <p className="text-lg">
          Status:{" "}
          <span
            className={
              auction.isLive
                ? "text-green-600 font-bold"
                : "text-red-600 font-bold"
            }
          >
            {auction.isLive ? "LIVE" : "NOT LIVE"}
          </span>
        </p>
      </div>

      {/* Current Player */}
      {auction.currentPlayer && (
        <div className="bg-white p-6 rounded-xl shadow mb-6 max-w-xl">
          <h2 className="text-2xl font-semibold mb-2">
            Player on Auction
          </h2>
          <p className="text-xl font-bold">
            {auction.currentPlayer.name}
          </p>
          <p className="mt-2">
            Current Bid: ₹{auction.currentBid}
          </p>
          <p className="mt-1 text-gray-600">
            Highest Bidder:{" "}
            {auction.highestBidder || "None"}
          </p>
        </div>
      )}

      {/* Admin Controls */}
      {role === "admin" && (
        <div className="bg-white p-6 rounded-xl shadow mb-6 max-w-xl">
          <h2 className="text-xl font-semibold mb-4">
            Admin Controls
          </h2>

          {!auction.isLive && (
            <>
              <input
                placeholder="Player Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />

              <input
                type="number"
                placeholder="Base Price"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              />

              <button
                onClick={startAuction}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Start Auction
              </button>
            </>
          )}

          {auction.isLive && (
            <button
              onClick={stopAuction}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Stop Auction
            </button>
          )}
        </div>
      )}

      {/* Bidding Controls */}
      {auction.isLive && role === "captain" && (
        <div className="bg-white p-6 rounded-xl shadow max-w-xl">
          <h2 className="text-xl font-semibold mb-4">
            Place Your Bid
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() =>
                placeBid(auction.currentBid + 100)
              }
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + ₹100
            </button>

            <button
              onClick={() =>
                placeBid(auction.currentBid + 1000)
              }
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              + ₹1000
            </button>
          </div>
        </div>
      )}

      {/* Spectator Message */}
      {auction.isLive &&
        role !== "admin" &&
        role !== "captain" && (
          <p className="mt-6 text-gray-600">
            Auction is live. You are viewing as spectator.
          </p>
        )}
    </div>
  );
}
