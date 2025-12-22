import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function AdminPlayers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // 🔐 Admin guard
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  // 📡 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/players/users`
      );
      setUsers(res.data);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔁 Toggle auction eligibility
  const toggleEligibility = async (userId, current) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/players/auction-eligibility`,
        {
          userId,
          isAuctionEligible: !current
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, isAuctionEligible: !current }
            : u
        )
      );

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to update player");
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

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {saved && (
        <div className="text-green-600 mb-4">
          Changes saved
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto mb-6">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">
                Auction Eligible
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3 font-medium">
                  {user.name}
                </td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={user.isAuctionEligible}
                    onChange={() =>
                      toggleEligibility(
                        user._id,
                        user.isAuctionEligible
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Done Button */}
      <button
        onClick={() => router.push("/admin")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Done
      </button>
    </div>
  );
}
