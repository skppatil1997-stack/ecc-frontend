import { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

let socket;

export default function AdminAuction() {
  const [auctionState, setAuctionState] = useState(null);
  const [basePrice, setBasePrice] = useState("");
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  /* =========================
     SOCKET CONNECTION
     ========================= */
  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("connect", () => {
      console.log("✅ Admin socket connected");
    });

    socket.on("auction:update", (state) => {
      console.log("📡 Auction update:", state);
      setAuctionState(state);
    });

    return () => socket.disconnect();
  }, []);

  /* =========================
     LOAD AUCTION PLAYERS
     ========================= */
  const loadPlayers = async () => {
    try {
      setLoadingPlayers(true);
      const res = await api.get("/admin/auction/players");
      setPlayers(res.data);
    } catch (err) {
      alert("Failed to load auction players");
    } finally {
      setLoadingPlayers(false);
    }
  };

  /* =========================
     AUCTION CONTROLS
     ========================= */
  const startAuction = () => {
    if (!basePrice || Number(basePrice) <= 0) {
      return alert("Enter valid base price");
    }

    socket.emit("auction:start", {
      basePrice: Number(basePrice)
    });
  };

  const nextPlayer = async () => {
    await loadPlayers();

    if (players.length === 0) {
      return alert("No auction players available");
    }

    // Pick random player
    const random =
      players[Math.floor(Math.random() * players.length)];

    socket.emit("auction:next-player", {
      player: random
    });
  };

  const stopAuction = () => {
    socket.emit("auction:stop");
  };

  return (
    <>
      <Navbar />

      <PageContainer title="Auction Control">
        {/* BASE PRICE */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Base Price (₹)
          </label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="border p-2 rounded w-64"
            placeholder="Enter base price"
          />
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            className="btn btn-primary"
            onClick={startAuction}
          >
            Start Auction
          </button>

          <button
            className="btn btn-secondary"
            onClick={nextPlayer}
            disabled={!auctionState?.isLive}
          >
            Next Player
          </button>

          <button
            className="btn btn-danger"
            onClick={stopAuction}
          >
            Stop Auction
          </button>
        </div>

        {/* CURRENT PLAYER */}
        {!auctionState?.isLive && (
          <p className="text-slate-500">
            Auction will start shortly…
          </p>
        )}

        {auctionState?.currentPlayer && (
          <div className="card max-w-xl">
            <h3 className="text-xl font-bold mb-2">
              {auctionState.currentPlayer.name}
            </h3>

            <p className="mb-1">
              <strong>Base Price:</strong> ₹
              {auctionState.basePrice}
            </p>

            <p className="mb-1">
              <strong>Current Bid:</strong> ₹
              {auctionState.currentBid}
            </p>

            <p>
              <strong>Highest Bidder:</strong>{" "}
              {auctionState.highestBidder
                ? auctionState.highestBidder.name
                : "—"}
            </p>
          </div>
        )}
      </PageContainer>
    </>
  );
}
