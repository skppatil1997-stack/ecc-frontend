import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    setMounted(true);
    setRole(localStorage.getItem("role"));
    setName(localStorage.getItem("name"));
  }, []);

  if (!mounted) return null; // 🚨 KEY FIX

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff"
      }}
    >
      {/* LEFT */}
      <strong
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/")}
      >
        Enthusiast Cricket Club
      </strong>

      {/* CENTER NAV */}
      {role === "admin" && (
        <div style={{ display: "flex", gap: 15 }}>
          <button onClick={() => router.push("/admin")}>Dashboard</button>
          <button onClick={() => router.push("/admin/teams")}>
            Manage Teams
          </button>
          <button onClick={() => router.push("/admin/players")}>
            Auction Players
          </button>
          <button onClick={() => router.push("/admin/auction")}>
            Auction Control
          </button>
        </div>
      )}

      {role === "player" && (
        <button onClick={() => router.push("/auction")}>
          Live Auction
        </button>
      )}

      {/* RIGHT */}
      <div>
        {name && <span style={{ marginRight: 10 }}>Hi, {name}</span>}
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
