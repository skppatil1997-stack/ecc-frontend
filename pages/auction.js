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
        <div className="mb-8 flex justify-center">
          {auctionState?.isLive ? (
            <div className="bg-red-100 text-red-700 px-6 py-2 rounded-full font-semibold">
              🔴 Auction LIVE
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-700 px-6 py-2 rounded-full font-semibold">
              ⏳ Auction will start soon
            </div>
          )}
        </div>

        {/* AUCTION NOT LIVE */}
        {!auctionState?.isLive && (
          <div className="flex justify-center">
            <div className="card text-center max-w-xl w-full">
              <p className="text-lg">
                Please wait while the Admin starts the auction.
              </p>
            </div>
          </div>
        )}

        {/* LIVE AUCTION — CENTERED */}
        {auctionState?.isLive && auctionState.currentPlayer && (
          <div className="flex justify-center mt-6">
            <div className="card w-full max-w-2xl text-center">
              {/* PLAYER INFO */}
              <p className="text-sm text-slate-500 mb-1">
                Now Bidding
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                {auctionState.currentPlayer.name}
              </h2>

              <p className="text-sm text-slate-500">
                {auctionState.currentPlayer.email}
              </p>

              {/* BID INFO */}
              <div className="mt-6">
                <p className="text-sm text-slate-500">
                  Current Highest Bid
                </p>
                <p className="text-5xl font-extrabold text-blue-700 mt-2">
                  ₹ {auctionState.currentBid}
                </p>

                <p className="mt-4 text-sm text-slate-500">
                  Highest Bidder
                </p>
                <p className="font-semibold text-lg">
                  {auctionState.highestBidder || "No bids yet"}
                </p>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </>
  );
}
