import { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/router";

export default function AdminPlayers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/players/users");
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleEligibility = async (userId, value) => {
    await api.put("/admin/players/eligibility", {
      userId,
      isAuctionEligible: value
    });
    loadUsers();
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 30 }}>
        <button onClick={() => router.back()}>⬅ Back</button>

        <h2>Select Auction Players</h2>

        {users.map((u) => (
          <div
            key={u._id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              marginBottom: 8
            }}
          >
            <strong>{u.name}</strong> ({u.email})

            <label style={{ marginLeft: 10 }}>
              <input
                type="checkbox"
                checked={u.isAuctionEligible || false}
                onChange={(e) =>
                  toggleEligibility(u._id, e.target.checked)
                }
              />
              Auction Eligible
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
