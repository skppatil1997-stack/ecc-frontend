import { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";

let socket;

export default function AuctionPage() {
  const [auctionState, setAuctionState] = useState(null);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (state) => {
      setAuctionState(state);
    });

    return () => socket.disconnect();
  }, []);

  const bid = (amount) => {
    socket.emit("auction:bid", {
      bidder: { name: localStorage.getItem("name") },
      amount
    });
  };

  if (!auctionState?.isLive) {
    return (
      <>
        <Navbar />
        <PageContainer title="Live Auction">
          <p>Auction has not started yet.</p>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageContainer title="Live Auction">
        {auctionState.currentPlayer && (
          <div className="card max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold">
              {auctionState.currentPlayer.name}
            </h2>

            <p className="my-4">
              Current Bid: ₹{auctionState.currentBid}
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="btn btn-primary"
                onClick={() => bid(auctionState.currentBid + 100)}
              >
                +100
              </button>

              <button
                className="btn btn-primary"
                onClick={() => bid(auctionState.currentBid + 1000)}
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
