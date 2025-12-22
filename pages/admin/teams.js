import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function AdminTeams() {
  const router = useRouter();

  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [purse, setPurse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 Admin guard
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  // 📡 Fetch teams + eligible players
  const fetchData = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teams`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/players/users`)
      ]);

      setTeams(teamsRes.data);
      setPlayers(usersRes.data.filter(u => u.isAuctionEligible));
    } catch (err) {
      setError("Failed to load data");
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
      alert("Team name and purse are required");
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/teams/create`, {
        name,
        purse
      });

      setName("");
      setPurse("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create team");
    }
  };

  // 👑 Assign Captain
  const assignCaptain = async (teamId, userId) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/assign-captain`,
        { teamId, userId }
      );
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to assign captain");
    }
  };

  // 🗑 Delete Team
  const deleteTeam = async (teamId) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}`
      );
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
      
      {/* 🔙 Back */}
      <button
        onClick={() => router.push("/admin")}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to Admin Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Manage Teams
      </h1>

      {/* ➕ Create Team */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Create Team</h2>

        <input
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />

        <input
          placeholder="Purse Amount"
          value={purse}
          onChange={(e) => setPurse(e.target.value)}
          type="number"
          className="border p-2 rounded w-full mb-4"
        />

        <button
          onClick={createTeam}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Team
        </button>
      </div>

      {/* 📋 Team List */}
      <div className="space-y-6 max-w-4xl">
        {teams.length === 0 && (
          <p className="text-gray-600">
            No teams created yet.
          </p>
        )}

        {teams.map(team => (
          <div
            key={team._id}
            className="bg-white p-6 rounded-xl shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {team.name}
              </h2>

              <button
                onClick={() => deleteTeam(team._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>

            <p className="mb-3 text-gray-600">
              Purse: ₹{team.purse}
            </p>

            {team.captain ? (
              <p className="text-green-700 font-medium">
                Captain: {team.captain.name}
              </p>
            ) : players.length === 0 ? (
              <p className="text-orange-600">
                No auction-eligible players available
              </p>
            ) : (
              <select
                className="border p-2 rounded max-w-sm"
                defaultValue=""
                onChange={(e) =>
                  assignCaptain(team._id, e.target.value)
                }
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
