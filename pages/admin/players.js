import { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/router";

export default function AdminPlayers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/players/users");
      setUsers(res.data);
    } catch (err) {
      console.error("LOAD USERS ERROR:", err);
      alert("Failed to load users. Check backend routes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleEligibility = async (userId, value) => {
    try {
      await api.put("/admin/players/eligibility", {
        userId,
        isAuctionEligible: value
      });
      loadUsers();
    } catch (err) {
      console.error("ELIGIBILITY UPDATE ERROR:", err);
      alert("Failed to update eligibility.");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <button onClick={() => router.back()} style={{ marginBottom: "20px" }}>
          ⬅ Back
        </button>

        <h2>Select Auction Players</h2>

        {loading && <p>Loading users...</p>}

        {!loading && users.length === 0 && (
          <p>No users found. Ask players to sign up!</p>
        )}

        {users.map((u) => (
          <div
            key={u._id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginTop: "10px",
              borderRadius: "6px",
              background: "#fff"
            }}
          >
            <strong>{u.name}</strong> — {u.email}
            <br />

            <label style={{ marginTop: "8px", display: "inline-block" }}>
              <input
                type="checkbox"
                checked={u.isAuctionEligible || false}
                onChange={(e) =>
                  toggleEligibility(u._id, e.target.checked)
                }
              />
              <span style={{ marginLeft: "6px" }}>Auction Eligible</span>
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
