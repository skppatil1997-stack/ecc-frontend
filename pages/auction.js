import { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";

/* 🔥 SOCKET MUST BE GLOBAL */
const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  transports: ["websocket"]
});

export default function Auction() {
  const [auctionState, setAuctionState] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));

    socket.on("auction:update", (state) => {
      console.log("📡 Auction update:", state);
      setAuctionState(state);
    });

    return () => {
      socket.off("auction:update");
    };
  }, []);

  const canBid =
    auctionState?.isLive &&
    auctionState?.currentPlayer &&
    role === "PLAYER";

  const placeBid = (inc) => {
    console.log("🟢 Bid clicked:", inc);

    socket.emit("auction:bid", {
      bidder: { role },
      amount: auctionState.currentBid + inc
    });
  };

  return (
    <>
      <Navbar />

      <PageContainer title="Live Auction">
        {auctionState && (
          <div
            className={`mb-4 px-4 py-2 rounded text-center font-semibold ${
              auctionState.isLive
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {auctionState.isLive
              ? "🔴 Auction is LIVE"
              : "⏳ Auction not started"}
          </div>
        )}

        {auctionState?.currentPlayer && (
          <div className="card max-w-md mx-auto text-center">
            <h3>{auctionState.currentPlayer.name}</h3>

            <p className="text-xl font-bold my-3">
              ₹{auctionState.currentBid}
            </p>

            {canBid ? (
              <div className="flex justify-center gap-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => placeBid(100)}
                >
                  +100
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => placeBid(1000)}
                >
                  +1000
                </button>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">
                Bidding disabled
              </p>
            )}
          </div>
        )}
      </PageContainer>
    </>
  );
}
