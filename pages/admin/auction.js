import { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

let socket;

export default function AdminAuction() {
  const [auctionState, setAuctionState] = useState(null);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (state) => {
      setAuctionState(state);
    });

    return () => socket.disconnect();
  }, []);

  const startAuction = () => {
    socket.emit("auction:start");
  };

  const setPlayer = () => {
    if (!playerName) return alert("Enter player name");

    socket.emit("auction:set-player", {
      name: playerName
    });

    setPlayerName("");
  };

  const stopAuction = () => {
    socket.emit("auction:stop");
  };

  return (
    <>
      <Navbar />
      <PageContainer title="Auction Control">
        <div className="flex gap-3 mb-6">
          <button className="btn btn-primary" onClick={startAuction}>
            Start Auction
          </button>

          <button className="btn btn-danger" onClick={stopAuction}>
            Stop Auction
          </button>
        </div>

        <div className="mb-6">
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Player Name"
            className="border p-2 rounded mr-2"
          />
          <button className="btn btn-secondary" onClick={setPlayer}>
            Set Player
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
