import { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

let socket;

export default function AdminAuction() {
  const [auctionState, setAuctionState] = useState(null);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (state) => {
      console.log("📡 Admin auction update:", state);
      setAuctionState(state);
    });

    return () => socket.disconnect();
  }, []);

  const startAuction = () => {
    socket.emit("auction:start", { basePrice: 0 });
  };

  const nextPlayer = async () => {
    const res = await api.get("/admin/auction/players");
    socket.emit("auction:next-player", { players: res.data });
  };

  const stopAuction = () => {
    socket.emit("auction:stop");
  };

  return (
    <>
      <Navbar />
      <PageContainer title="Auction Control">
        <div className="flex gap-4 mb-6">
          <button className="btn btn-primary" onClick={startAuction}>
            Start Auction
          </button>
          <button className="btn btn-secondary" onClick={nextPlayer}>
            Next Player
          </button>
          <button className="btn btn-danger" onClick={stopAuction}>
            Stop Auction
          </button>
        </div>

        {auctionState?.currentPlayer && (
          <div className="card max-w-md">
            <h3>{auctionState.currentPlayer.name}</h3>
            <p>Current Bid: ₹{auctionState.currentBid}</p>
            <p>
              Highest Bidder:{" "}
              {auctionState.highestBidder?.name || "—"}
            </p>
          </div>
        )}
      </PageContainer>
    </>
  );
}
