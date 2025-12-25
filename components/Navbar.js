import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");

  /* =========================
     SYNC AUTH STATE
     ========================= */
  useEffect(() => {
    setMounted(true);

    const syncAuth = () => {
      setRole(localStorage.getItem("role"));
      setName(localStorage.getItem("name"));
    };

    // Initial read
    syncAuth();

    // Re-read on route change
    router.events.on("routeChangeComplete", syncAuth);

    return () => {
      router.events.off("routeChangeComplete", syncAuth);
    };
  }, [router.events]);

  if (!mounted) return null;

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LEFT – BRAND */}
        <div
          className="font-bold text-lg text-blue-700 cursor-pointer"
          onClick={() => router.push("/")}
        >
          Enthusiast Cricket Club
        </div>

        {/* CENTER – NAV */}
        {role === "ADMIN" && (
          <nav className="flex gap-2">
            <NavButton label="Dashboard" onClick={() => router.push("/admin")} />
            <NavButton label="Teams" onClick={() => router.push("/admin/teams")} />
            <NavButton label="Players" onClick={() => router.push("/admin/players")} />
            <NavButton label="Auction" onClick={() => router.push("/admin/auction")} />
          </nav>
        )}

        {role === "PLAYER" && (
          <nav>
            <NavButton
              label="Live Auction"
              onClick={() => router.push("/auction")}
            />
          </nav>
        )}

        {/* RIGHT – USER */}
        <div className="flex items-center gap-3">
          {name && (
            <span className="text-sm text-slate-600">
              Hi, <strong>{name}</strong>
            </span>
          )}
          {role && (
            <button
              onClick={logout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* =========================
   NAV BUTTON
   ========================= */
function NavButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
    >
      {label}
    </button>
  );
}
