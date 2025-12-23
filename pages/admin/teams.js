import { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      // ✅ CORRECT ADMIN ROUTE
      const res = await api.get("/admin/team");
      setTeams(res.data);
    } catch (err) {
      console.error("LOAD TEAMS ERROR:", err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px" }}>
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
              padding: "15px",
              marginBottom: "12px",
              borderRadius: "6px",
              background: "#fff"
            }}
          >
            <h3>{team.name}</h3>
            <p><strong>Purse:</strong> ₹{team.purse}</p>
            <p>
              <strong>Captain:</strong>{" "}
              {team.captain ? team.captain.name : "Not Assigned"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
