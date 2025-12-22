import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import api from "../utils/api";


let socket;

export default function Auction() {
  const router = useRouter();

  const [auction, setAuction] = useState(null);
  const [players, setPlayers] = useState([]);
  const [basePrice, setBasePrice] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("name");

    if (!storedRole) {
      router.push("/login");
      return;
    }

    setRole(storedRole);
    setName(storedName);

    // 🔌 Connect Socket
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (data) => {
      setAuction(data);
    });

    socket.on("auction:end", (data) => {
      alert(data.msg);
    });

    fetchAuctionPlayers();

    return () => {
      socket.disconnect();
    };
  }, [router]);

  // 📡 Load auction player pool (AUTH REQUIRED)
  const fetchAuctionPlayers = async () => {
    try {
      const res = await api.get("/admin/auction/players");
      setPlayers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load auction players");
    } finally {
      setLoadingPlayers(false);
    }
  };

  // 🚀 Admin starts auction
  const startAuction = () => {
    if (!basePrice) {
      alert("Base price required");
      return;
    }

    socket.emit("auction:start", {
      basePrice: Number(basePrice)
    });

    setBasePrice("");
  };

  // 🎲 Admin picks next random player
  const nextPlayer = () => {
    if (players.length === 0) {
      alert("No players available for auction");
      return;
    }

    socket.emit("auction:next-player", {
      players
    });
  };

  // 💰 Bid (Captain only)
  const placeBid = (amount) => {
    socket.emit("auction:bid", {
      bidder: name,
      amount
    });
  };

  // ⛔ Stop auction
  const stopAuction = () => {
    socket.emit("auction:stop");
  };

  if (!auction || loadingPlayers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading auction...
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

      {/* Status */}
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

      {/* Player Card */}
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
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={nextPlayer}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Next Player
              </button>

              <button
                onClick={stopAuction}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Stop Auction
              </button>
            </div>
          )}
        </div>
      )}

      {/* Captain Bidding */}
      {auction.isLive &&
        role === "captain" &&
        auction.currentPlayer && (
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

      {/* Spectator */}
      {auction.isLive &&
        role !== "admin" &&
        role !== "captain" && (
          <p className="mt-6 text-gray-600">
            Auction is live. You are watching as spectator.
          </p>
        )}
    </div>
  );
}
