import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/utils/api";


export default function AdminTeams() {
  const router = useRouter();

  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [purse, setPurse] = useState("");
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editedPurse, setEditedPurse] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔐 Admin guard
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  // 📡 Load teams + players
  const fetchData = async () => {
    try {
      const teamsRes = await api.get("/teams");
      const usersRes = await api.get("/admin/players/users");

      setTeams(teamsRes.data);
      setPlayers(usersRes.data.filter(u => u.isAuctionEligible));
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ Create Team
  const createTeam = async () => {
    if (!name || !purse) {
      alert("Team name and purse required");
      return;
    }

    try {
      await api.post("/teams/create", { name, purse });
      setName("");
      setPurse("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create team");
    }
  };

  // 💰 Update Purse
  const updatePurse = async (teamId) => {
    try {
      await api.put("/teams/update-purse", {
        teamId,
        purse: editedPurse
      });
      setEditingTeamId(null);
      setEditedPurse("");
      fetchData();
    } catch {
      alert("Failed to update purse");
    }
  };

  // 👑 Assign Captain
  const assignCaptain = async (teamId, userId) => {
    try {
      await api.post("/teams/assign-captain", {
        teamId,
        userId
      });
      fetchData();
    } catch {
      alert("Failed to assign captain");
    }
  };

  // ❌ Remove Captain
  const removeCaptain = async (teamId) => {
    if (!confirm("Remove captain from this team?")) return;

    try {
      await api.post("/teams/remove-captain", { teamId });
      fetchData();
    } catch {
      alert("Failed to remove captain");
    }
  };

  // 🗑 Delete Team
  const deleteTeam = async (teamId) => {
    if (!confirm("Delete this team permanently?")) return;

    try {
      await api.delete(`/teams/${teamId}`);
      fetchData();
    } catch {
      alert("Failed to delete team");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading teams...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => router.push("/admin")}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to Admin Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Manage Teams</h1>

      {/* Create Team */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Create Team</h2>

        <input
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />

        <input
          type="number"
          placeholder="Purse Amount"
          value={purse}
          onChange={(e) => setPurse(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <button
          onClick={createTeam}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Team
        </button>
      </div>

      {/* Teams List */}
      <div className="space-y-6 max-w-4xl">
        {teams.map(team => (
          <div key={team._id} className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between mb-2">
              <h2 className="text-2xl font-semibold">{team.name}</h2>
              <button
                onClick={() => deleteTeam(team._id)}
                className="text-red-600 hover:underline"
              >
                Delete Team
              </button>
            </div>

            {/* Purse */}
            {editingTeamId === team._id ? (
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  value={editedPurse}
                  onChange={(e) => setEditedPurse(e.target.value)}
                  className="border p-2 rounded"
                />
                <button
                  onClick={() => updatePurse(team._id)}
                  className="bg-green-600 text-white px-3 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTeamId(null)}
                  className="text-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="text-gray-700 mb-2">
                Purse: ₹{team.purse}
                <button
                  onClick={() => {
                    setEditingTeamId(team._id);
                    setEditedPurse(team.purse);
                  }}
                  className="text-blue-600 ml-2 hover:underline"
                >
                  Edit
                </button>
              </p>
            )}

            {/* Captain */}
            {team.captain ? (
              <div className="flex gap-4 items-center">
                <p className="text-green-700">
                  Captain: {team.captain.name}
                </p>
                <button
                  onClick={() => removeCaptain(team._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove Captain
                </button>
              </div>
            ) : (
              <select
                defaultValue=""
                onChange={(e) =>
                  assignCaptain(team._id, e.target.value)
                }
                className="border p-2 rounded max-w-sm"
              >
                <option value="" disabled>
                  Select Captain
                </option>
                {players.map(player => (
                  <option key={player._id} value={player._id}>
                    {player.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
