import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();

  // 🔐 Frontend admin guard
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        
        {/* Manage Teams */}
        <div
          onClick={() => router.push("/admin/teams")}
          className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Manage Teams
          </h2>
          <p className="text-gray-600">
            Create teams and assign purse
          </p>
        </div>

        {/* Select Auction Players */}
        <div
          onClick={() => router.push("/admin/players")}
          className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Select Auction Players
          </h2>
          <p className="text-gray-600">
            Choose which players enter the auction
          </p>
        </div>

        {/* Auction Control (coming soon) */}
        <div className="bg-white p-6 rounded-xl shadow opacity-60">
          <h2 className="text-xl font-semibold mb-2">
            Auction Control
          </h2>
          <p className="text-gray-600">
            Start, pause and monitor the auction
          </p>
        </div>

      </div>
    </div>
  );
}
