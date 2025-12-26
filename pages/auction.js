import { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";

let socket;

export default function AuctionPage() {
  const [auctionState, setAuctionState] = useState(null);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("auction:update", (state) => {
      console.log("📡 Auction update:", state);
      setAuctionState(state);
    });

    return () => socket.disconnect();
  }, []);

  const placeBid = (increment) => {
    if (!auctionState?.currentPlayer) return;

    console.log("🔥 BID CLICKED", increment);

    socket.emit("auction:bid", {
      bidder: {
        name: localStorage.getItem("name"),
        role: "CAPTAIN"
      },
      amount: auctionState.currentBid + increment
    });
  };

  return (
    <>
      <Navbar />
      <PageContainer title="Live Auction">
        {!auctionState?.isLive && (
          <p className="text-center text-slate-500">
            Auction will go live shortly...
          </p>
        )}

        {auctionState?.currentPlayer && (
          <div className="card max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold mb-2">
              {auctionState.currentPlayer.name}
            </h2>

            <p className="mb-4">
              Current Bid: ₹{auctionState.currentBid}
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="btn btn-primary"
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
          </div>
        )}
      </PageContainer>
    </>
  );
}
