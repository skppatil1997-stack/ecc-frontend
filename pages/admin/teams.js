import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function AdminTeams() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD TEAMS
     ========================= */
  const loadTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      alert("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  /* =========================
     DELETE TEAM
     ========================= */
  const deleteTeam = async (teamId) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      await api.delete(`/teams/${teamId}`);
      loadTeams();
    } catch (err) {
      alert("Failed to delete team");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: 30 }}>
        <button onClick={() => router.back()} style={{ marginBottom: 20 }}>
          ⬅ Back
        </button>

        <h2>Manage Teams</h2>

        {loading && <p>Loading teams...</p>}

        {!loading && teams.length === 0 && (
          <p>No teams created yet.</p>
        )}

        {teams.map((team) => (
          <div
            key={team._id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              marginBottom: 12,
              borderRadius: 6,
              background: "#fff"
            }}
          >
            <h3>{team.name}</h3>
            <p><strong>Purse:</strong> ₹{team.purse}</p>
            <p>
              <strong>Captain:</strong>{" "}
              {team.captain ? team.captain.name : "Not Assigned"}
            </p>

            {/* =========================
               ACTION BUTTONS
               ========================= */}
            <div style={{ marginTop: 10 }}>
              {/* Edit Team */}
              <button
                onClick={() =>
                  router.push(`/admin/edit-team?teamId=${team._id}`)
                }
                style={{ marginRight: 8 }}
              >
                Edit Team
              </button>

              {/* Assign / Change Captain */}
              {!team.captain ? (
                <button
                  onClick={() =>
                    router.push(
                      `/admin/assign-captain?teamId=${team._id}`
                    )
                  }
                  style={{ marginRight: 8 }}
                >
                  Assign Captain
                </button>
              ) : (
                <button
                  onClick={() =>
                    router.push(
                      `/admin/assign-captain?teamId=${team._id}`
                    )
                  }
                  style={{ marginRight: 8 }}
                >
                  Change Captain
                </button>
              )}

              {/* Delete Team */}
              <button
                onClick={() => deleteTeam(team._id)}
                style={{ color: "red" }}
              >
                Delete Team
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
