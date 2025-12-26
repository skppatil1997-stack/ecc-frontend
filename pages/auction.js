import { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";

let socket;

export default function AuctionPage() {
  const [auction, setAuction] = useState(null);
  const name = typeof window !== "undefined" ? localStorage.getItem("name") : "";
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : "";
  const isCaptain = typeof window !== "undefined"
    ? localStorage.getItem("isCaptain") === "true"
    : false;

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (state) => {
      setAuction(state);
    });

    return () => socket.disconnect();
  }, []);

  const bid = (amount) => {
    socket.emit("auction:bid", {
      bidderName: name,
      increment: amount
    });
  };

  return (
    <>
      <Navbar />

      <PageContainer title="Live Auction">
        {!auction?.isLive && (
          <p className="text-center text-slate-500">
            Auction will start soon…
          </p>
        )}

        {auction?.currentPlayer && (
          <div className="card max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">
              {auction.currentPlayer.name}
            </h2>

            <p className="text-slate-500 mb-2">
              Base Price: ₹{auction.basePrice}
            </p>

            <p className="text-xl font-semibold mb-4">
              Current Bid: ₹{auction.currentBid}
            </p>

            {auction.highestBidder && (
              <p className="text-green-600 mb-4">
                Highest Bid: {auction.highestBidder}
              </p>
            )}

            {role === "PLAYER" && isCaptain && (
              <div className="flex justify-center gap-4">
                <button
                  className="btn btn-primary"
                  onClick={() => bid(100)}
                >
                  +100
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => bid(1000)}
                >
                  +1000
                </button>
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </>
  );
}
