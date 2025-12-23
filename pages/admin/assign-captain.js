import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function AssignCaptain() {
  const router = useRouter();
  const { teamId } = router.query;

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD TEAM DETAILS
     ========================= */
  const loadTeam = async () => {
    try {
      const res = await api.get(`/teams`);
      const foundTeam = res.data.find((t) => t._id === teamId);
      setTeam(foundTeam);
    } catch (err) {
      alert("Failed to load team");
    }
  };

  /* =========================
     LOAD AUCTION PLAYERS
     ========================= */
  const loadPlayers = async () => {
    try {
      const res = await api.get("/admin/auction/players");
      setPlayers(res.data);
    } catch (err) {
      alert("Failed to load auction players");
    }
  };

  useEffect(() => {
    if (teamId) {
      Promise.all([loadTeam(), loadPlayers()]).finally(() =>
        setLoading(false)
      );
    }
  }, [teamId]);

  /* =========================
     ASSIGN / CHANGE CAPTAIN
     ========================= */
  const assignCaptain = async (userId) => {
    try {
      await api.post("/teams/assign-captain", {
        teamId,
        userId
      });

      alert("Captain assigned successfully");
      router.push("/admin/teams");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to assign captain");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 30 }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: 30 }}>
        <button onClick={() => router.back()} style={{ marginBottom: 20 }}>
          ⬅ Back
        </button>

        <h2>
          {team?.captain ? "Change Captain" : "Assign Captain"}
        </h2>

        <h3 style={{ marginBottom: 20 }}>
          Team: <strong>{team?.name}</strong>
        </h3>

        {players.length === 0 && (
          <p>No auction-eligible players available.</p>
        )}

        {players.map((player) => (
          <div
            key={player._id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
              background: "#fff"
            }}
          >
            <strong>{player.name}</strong> ({player.email})

            {player.isCaptain && (
              <span style={{ color: "green", marginLeft: 10 }}>
                (Already Captain)
              </span>
            )}

            <div style={{ marginTop: 8 }}>
              <button
                disabled={player.isCaptain}
                onClick={() => assignCaptain(player._id)}
              >
                {team?.captain ? "Change Captain" : "Assign Captain"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
