import { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =========================
     LOAD USERS
     ========================= */
  const loadPlayers = async () => {
    try {
      const res = await api.get("/admin/players/users");
      setPlayers(res.data);
    } catch (err) {
      alert("Failed to load players");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  /* =========================
     TOGGLE AUCTION ELIGIBILITY
     ========================= */
  const toggleEligibility = async (userId, value) => {
    try {
      setSaving(true);

      await api.put("/admin/players/eligibility", {
        userId,
        isAuctionEligible: value
      });

      setPlayers((prev) =>
        prev.map((p) =>
          p._id === userId ? { ...p, isAuctionEligible: value } : p
        )
      );
    } catch (err) {
      alert("Failed to update eligibility");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <PageContainer title="Auction Players">
        {loading && <p>Loading players...</p>}

        {!loading && players.length === 0 && (
          <p className="text-slate-500">No users found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((player) => (
            <div
              key={player._id}
              className="card flex justify-between items-center"
            >
              <div>
                <h3 className="text-base">{player.name}</h3>
                <p className="text-sm text-slate-500">
                  {player.email}
                </p>

                {player.isCaptain && (
                  <p className="text-xs text-green-600 mt-1">
                    Captain
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm">
                  {player.isAuctionEligible
                    ? "Eligible"
                    : "Not Eligible"}
                </span>

                <input
                  type="checkbox"
                  checked={player.isAuctionEligible}
                  disabled={saving}
                  onChange={(e) =>
                    toggleEligibility(
                      player._id,
                      e.target.checked
                    )
                  }
                  className="h-5 w-5 accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </>
  );
}
