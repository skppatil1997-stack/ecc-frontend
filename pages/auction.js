import { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";

let socket;

export default function LiveAuction() {
  const [auctionState, setAuctionState] = useState(null);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (state) => {
      setAuctionState(state);
    });

    socket.on("auction:end", () => {
      setAuctionState(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />

      <PageContainer title="Live Auction">
        {/* STATUS BAR */}
        <div className="mb-6">
          {auctionState?.isLive ? (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold">
              🔴 Auction LIVE
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-semibold">
              ⏳ Auction will start soon
            </div>
          )}
        </div>

        {/* NO AUCTION */}
        {!auctionState?.isLive && (
          <div className="card text-center">
            <p className="text-lg">
              Please wait while the Admin starts the auction.
            </p>
          </div>
        )}

        {/* LIVE PLAYER */}
        {auctionState?.isLive && auctionState.currentPlayer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PLAYER CARD */}
            <div className="card">
              <h3 className="mb-2">Current Player</h3>
              <p className="text-xl font-bold">
                {auctionState.currentPlayer.name}
              </p>
              <p className="text-sm text-slate-500">
                {auctionState.currentPlayer.email}
              </p>

              <div className="mt-4">
                <p className="text-sm">Base Price</p>
                <p className="text-lg font-semibold">
                  ₹ {auctionState.currentBid}
                </p>
              </div>
            </div>

            {/* BID CARD */}
            <div className="card text-center">
              <p className="text-sm text-slate-500">Current Highest Bid</p>
              <p className="text-4xl font-bold text-blue-700 mt-2">
                ₹ {auctionState.currentBid}
              </p>

              <p className="mt-4 text-sm">
                Highest Bidder:
              </p>
              <p className="font-semibold">
                {auctionState.highestBidder || "No bids yet"}
              </p>
            </div>
          </div>
        )}
      </PageContainer>
    </>
  );
}
