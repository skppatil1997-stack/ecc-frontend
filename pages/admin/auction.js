import { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

let socket;

export default function AdminAuction() {
  const [auctionState, setAuctionState] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on("auction:update", (state) => {
      setAuctionState(state);
    });

    socket.on("auction:sold", () => {
      setSelectedTeam("");
    });

    loadTeams();

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      alert("Failed to load teams");
    }
  };

  /* =========================
     AUCTION CONTROLS
     ========================= */
  const startAuction = () => {
    socket.emit("auction:start", { basePrice: 0 });
  };

  const nextPlayer = async () => {
    try {
      const res = await api.get("/admin/auction/players");
      socket.emit("auction:next-player", {
        players: res.data
      });
    } catch {
      alert("Failed to load auction players");
    }
  };

  const stopAuction = () => {
    socket.emit("auction:stop");
  };

  /* =========================
     SELL PLAYER
     ========================= */
  const sellPlayer = async () => {
    if (!auctionState?.currentPlayer || !selectedTeam) {
      alert("Select a team first");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auction/sell", {
        playerId: auctionState.currentPlayer._id,
        teamId: selectedTeam,
        price: auctionState.currentBid
      });

      alert("Player SOLD successfully");
    } catch (err) {
      alert(err.response?.data?.msg || "Sell failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <PageContainer title="Auction Control">
        {/* AUCTION BUTTONS */}
        <div className="flex flex-wrap gap-4 mb-6">
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

        {/* CURRENT PLAYER */}
        {auctionState?.currentPlayer && (
          <div className="card max-w-xl">
            <h3 className="mb-2">
              {auctionState.currentPlayer.name}
            </h3>

            <p className="text-sm text-slate-500 mb-2">
              Current Bid: ₹{auctionState.currentBid}
            </p>

            {/* TEAM SELECT */}
            <select
              className="border p-2 rounded w-full mb-4"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">Select Winning Team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>

            <button
              className="btn btn-primary w-full"
              onClick={sellPlayer}
              disabled={loading}
            >
              {loading ? "Selling..." : "SOLD"}
            </button>
          </div>
        )}
      </PageContainer>
    </>
  );
}
