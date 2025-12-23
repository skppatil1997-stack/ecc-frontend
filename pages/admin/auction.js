import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";

let socket;

export default function AdminAuctionControl() {
  const router = useRouter();

  const [auctionState, setAuctionState] = useState(null);
  const [players, setPlayers] = useState([]);
  const [basePrice, setBasePrice] = useState(1000);

  /* =========================
     SOCKET CONNECT
     ========================= */
  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (state) => {
      setAuctionState(state);
    });

    socket.on("auction:end", (data) => {
      alert(data.msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* =========================
     LOAD AUCTION PLAYERS
     ========================= */
  const loadPlayers = async () => {
    try {
      const res = await api.get("/admin/auction/players");
      setPlayers(res.data);
    } catch (err) {
      alert("Failed to load auction players");
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  /* =========================
     START AUCTION
     ========================= */
  const startAuction = () => {
    socket.emit("auction:start", {
      basePrice: Number(basePrice)
    });
  };

  /* =========================
     NEXT RANDOM PLAYER
     ========================= */
  const nextPlayer = () => {
    socket.emit("auction:next-player", {
      players
    });
  };

  /* =========================
     STOP AUCTION
     ========================= */
  const stopAuction = () => {
    socket.emit("auction:stop");
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: 30 }}>
        <button onClick={() => router.back()} style={{ marginBottom: 20 }}>
          ⬅ Back
        </button>

        <h2>Admin Auction Control</h2>

        {/* =========================
            AUCTION STATUS
           ========================= */}
        <div style={{ marginBottom: 20 }}>
          <strong>Status:</strong>{" "}
          {auctionState?.isLive ? "LIVE 🔴" : "NOT LIVE"}
        </div>

        {/* =========================
            START AUCTION
           ========================= */}
        {!auctionState?.isLive && (
          <div style={{ marginBottom: 20 }}>
            <label>Base Price</label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              style={{ marginLeft: 10, marginRight: 10 }}
            />
            <button onClick={startAuction}>Start Auction</button>
          </div>
        )}

        {/* =========================
            LIVE AUCTION CONTROLS
           ========================= */}
        {auctionState?.isLive && (
          <>
            <button onClick={nextPlayer} style={{ marginBottom: 20 }}>
              Next Player
            </button>

            <button
              onClick={stopAuction}
              style={{ marginLeft: 10, color: "red" }}
            >
              Stop Auction
            </button>

            {auctionState.currentPlayer && (
              <div style={{ marginTop: 30 }}>
                <h3>Current Player</h3>
                <p><strong>Name:</strong> {auctionState.currentPlayer.name}</p>
                <p><strong>Email:</strong> {auctionState.currentPlayer.email}</p>
                <p><strong>Current Bid:</strong> ₹{auctionState.currentBid}</p>
                <p>
                  <strong>Highest Bidder:</strong>{" "}
                  {auctionState.highestBidder || "None"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
