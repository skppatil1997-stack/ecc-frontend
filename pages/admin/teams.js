import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function AdminTeams() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 Admin guard
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  // 📡 Fetch teams & players
  const fetchData = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teams`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/players/users`)
      ]);

      setTeams(teamsRes.data);
      setPlayers(
        usersRes.data.filter((u) => u.isAuctionEligible)
      );
    } catch (err) {
      setError("Failed to load teams or players");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 👑 Assign captain
  const assignCaptain = async (teamId, userId) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/assign-captain`,
        { teamId, userId }
      );

      alert("Captain assigned successfully");
      fetchData(); // refresh UI
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          "Failed to assign captain"
      );
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
      <h1 className="text-3xl font-bold mb-8">
        Assign Captains to Teams
      </h1>

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      <div className="space-y-6 max-w-4xl">
        {teams.map((team) => (
          <div
            key={team._id}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-2xl font-semibold mb-4">
              {team.name}
            </h2>

            {team.captain ? (
              <p className="text-green-700 font-medium">
                Captain: {team.captain.name}
              </p>
            ) : (
              <div>
                <p className="mb-2 text-gray-600">
                  Select Captain:
                </p>
                <select
                  className="border p-2 rounded w-full max-w-sm"
                  defaultValue=""
                  onChange={(e) =>
                    assignCaptain(team._id, e.target.value)
                  }
                >
                  <option value="" disabled>
                    Choose player
                  </option>
                  {players.map((player) => (
                    <option
                      key={player._id}
                      value={player._id}
                    >
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
