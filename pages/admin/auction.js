import { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

let socket;

export default function AdminAuction() {
  const [auction, setAuction] = useState(null);
  const [players, setPlayers] = useState([]);
  const [basePrice, setBasePrice] = useState(1000);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (state) => {
      setAuction(state);
    });

    loadPlayers();

    return () => socket.disconnect();
  }, []);

  const loadPlayers = async () => {
    const res = await api.get("/admin/auction/players");
    setPlayers(res.data);
  };

  const startAuction = () => {
    socket.emit("auction:start", { basePrice });
  };

  const nextPlayer = () => {
    const random =
      players[Math.floor(Math.random() * players.length)];
    socket.emit("auction:next-player", { player: random });
  };

  const stopAuction = () => {
    socket.emit("auction:stop");
  };

  return (
    <>
      <Navbar />
      <PageContainer title="Auction Control">
        <div className="flex gap-3 mb-6">
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="border p-2 rounded"
          />
          <button className="btn btn-primary" onClick={startAuction}>
            Start
          </button>
          <button className="btn btn-secondary" onClick={nextPlayer}>
            Next Player
          </button>
          <button className="btn btn-danger" onClick={stopAuction}>
            Stop
          </button>
        </div>

        {auction?.currentPlayer && (
          <div className="card max-w-xl">
            <h2 className="text-xl font-bold">
              {auction.currentPlayer.name}
            </h2>
            <p>Current Bid: ₹{auction.currentBid}</p>
            <p>
              Highest Bidder:{" "}
              {auction.highestBidder || "—"}
            </p>
          </div>
        )}
      </PageContainer>
    </>
  );
}
