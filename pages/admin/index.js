import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-10">
      <h1 className="text-4xl font-extrabold mb-10 text-blue-900">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        
        {/* Manage Teams */}
        <div
          onClick={() => router.push("/admin/teams")}
          className="cursor-pointer bg-white border-l-8 border-blue-600 p-8 rounded-2xl shadow hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold mb-2 text-blue-800">
            Manage Teams
          </h2>
          <p className="text-gray-600">
            Create teams, assign purse and captains
          </p>
        </div>

        {/* Select Auction Players */}
        <div
          onClick={() => router.push("/admin/players")}
          className="cursor-pointer bg-white border-l-8 border-green-600 p-8 rounded-2xl shadow hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold mb-2 text-green-800">
            Select Auction Players
          </h2>
          <p className="text-gray-600">
            Choose which registered players enter the auction
          </p>
        </div>

        {/* Auction Control */}
        <div className="bg-white border-l-8 border-purple-600 p-8 rounded-2xl shadow opacity-70">
          <h2 className="text-2xl font-bold mb-2 text-purple-800">
            Auction Control
          </h2>
          <p className="text-gray-600">
            Start, pause and monitor live auction (coming soon)
          </p>
        </div>

      </div>
    </div>
  );
}
