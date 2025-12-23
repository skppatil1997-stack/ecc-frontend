import { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/team");
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

        {!loading && teams.length === 0 && <p>No teams created yet.</p>}

        {teams.map((team) => (
          <div
            key={team._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "6px"
            }}
          >
            <h3>{team.name}</h3>
            <p>Purse: ₹{team.purse}</p>
            <p>
              Captain:{" "}
              {team.captain ? team.captain.name : "Not Assigned"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
