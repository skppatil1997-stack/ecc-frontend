import { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/router";

export default function AdminTeams() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [purse, setPurse] = useState("");

  const loadTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      alert("Failed to load teams");
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const createTeam = async () => {
    if (!name || !purse) return alert("Name & purse required");
    await api.post("/teams/create", { name, purse });
    setName("");
    setPurse("");
    loadTeams();
  };

  const deleteTeam = async (id) => {
    if (!confirm("Delete this team?")) return;
    await api.delete(`/teams/${id}`);
    loadTeams();
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 30 }}>
        <button onClick={() => router.back()}>⬅ Back</button>

        <h2>Manage Teams</h2>

        <div style={{ marginBottom: 20 }}>
          <input
            placeholder="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Purse"
            type="number"
            value={purse}
            onChange={(e) => setPurse(e.target.value)}
          />
          <button onClick={createTeam}>Create Team</button>
        </div>

        {teams.map((team) => (
          <div
            key={team._id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 10
            }}
          >
            <h3>{team.name}</h3>
            <p>Purse: ₹{team.purse}</p>
            <p>
              Captain: {team.captain ? team.captain.name : "Not assigned"}
            </p>

            <button
              onClick={() =>
                router.push(`/admin/assign-captain?teamId=${team._id}`)
              }
            >
              Assign / Change Captain
            </button>

            <button
              style={{ marginLeft: 10, color: "red" }}
              onClick={() => deleteTeam(team._id)}
            >
              Delete Team
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
