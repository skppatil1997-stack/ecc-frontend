import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";


export default function AdminPlayers() {
  const router = useRouter();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Admin guard
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  // 📡 Load all users
  const fetchPlayers = async () => {
    try {
      const res = await api.get("/admin/players/users");
      setPlayers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // ✅ Toggle auction eligibility
  const toggleEligibility = async (userId, currentValue) => {
    try {
      await api.put("/admin/players/eligibility", {
        userId,
        isAuctionEligible: !currentValue
      });
      fetchPlayers();
    } catch {
      alert("Failed to update eligibility");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading players...
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
        Select Auction Players
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden max-w-4xl">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-center p-3">Auction Eligible</th>
              <th className="text-center p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {players.map(player => (
              <tr
                key={player._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{player.name}</td>
                <td className="p-3">{player.email}</td>

                <td className="p-3 text-center">
                  {player.isAuctionEligible ? "✅" : "❌"}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() =>
                      toggleEligibility(
                        player._id,
                        player.isAuctionEligible
                      )
                    }
                    className={`px-3 py-1 rounded text-white ${
                      player.isAuctionEligible
                        ? "bg-red-600"
                        : "bg-green-600"
                    }`}
                  >
                    {player.isAuctionEligible
                      ? "Remove"
                      : "Add"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {players.length === 0 && (
          <p className="p-6 text-center text-gray-600">
            No users found
          </p>
        )}
      </div>
    </div>
  );
}
