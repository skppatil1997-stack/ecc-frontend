import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <div style={{ padding: 30 }}>
        <h2>Admin Dashboard</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginTop: 30
          }}
        >
          {/* MANAGE TEAMS */}
          <div
            style={cardStyle}
            onClick={() => router.push("/admin/teams")}
          >
            <h3>Manage Teams</h3>
            <p>Create, edit teams and assign captains</p>
          </div>

          {/* AUCTION PLAYERS */}
          <div
            style={cardStyle}
            onClick={() => router.push("/admin/players")}
          >
            <h3>Auction Players</h3>
            <p>Select players eligible for auction</p>
          </div>

          {/* AUCTION CONTROL */}
          <div
            style={cardStyle}
            onClick={() => router.push("/admin/auction")}
          >
            <h3>Auction Control</h3>
            <p>Start auction, pick players, control bidding</p>
          </div>
        </div>
      </div>
    </>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  padding: 20,
  borderRadius: 8,
  background: "#fff",
  cursor: "pointer",
  transition: "all 0.2s ease"
};
