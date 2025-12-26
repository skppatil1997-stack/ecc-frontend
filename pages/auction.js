import { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";

let socket;

export default function Auction() {
  const [auctionState, setAuctionState] = useState(null);
  const [user, setUser] = useState(null);
  const [canBid, setCanBid] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const userId = localStorage.getItem("userId");
    const teamId = localStorage.getItem("teamId");

    setUser({ role, name, userId, teamId });

    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (state) => {
      setAuctionState(state);
    });

    return () => socket.disconnect();
  }, []);

  /* =========================
     DETERMINE BID RIGHTS
     ========================= */
  useEffect(() => {
    if (!user || !auctionState?.isLive) {
      setCanBid(false);
      return;
    }

    // Admin can bid
    if (user.role === "admin") {
      setCanBid(true);
      return;
    }

    // Captain can bid
    if (user.role === "player" && user.teamId) {
      setCanBid(true);
      return;
    }

    setCanBid(false);
  }, [user, auctionState]);

  const placeBid = (increment) => {
    if (!auctionState?.currentPlayer) return;

    const newAmount = auctionState.currentBid + increment;

    socket.emit("auction:bid", {
      bidder: {
        userId: user.userId,
        teamId: user.teamId
      },
      amount: newAmount
    });
  };

  return (
    <>
      <Navbar />

      <PageContainer title="Live Auction">
        {/* AUCTION STATUS */}
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
              : "⏳ Auction will start shortly"}
          </div>
        )}

        {/* PLAYER CARD */}
        {auctionState?.currentPlayer && (
          <div className="card max-w-md mx-auto text-center">
            <h3 className="mb-2">
              {auctionState.currentPlayer.name}
            </h3>

            <p className="text-lg font-semibold mb-4">
              ₹{auctionState.currentBid}
            </p>

            {/* BID BUTTONS */}
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
                Only captains can bid
              </p>
            )}
          </div>
        )}
      </PageContainer>
    </>
  );
}