import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const name =
    typeof window !== "undefined"
      ? localStorage.getItem("name")
      : null;

  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role")
      : null;

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!name || !role) return null;

  return (
    <div className="w-full bg-white shadow px-6 py-3 flex justify-between items-center">
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => router.push("/")}
      >
        Enthusiast Cricket Club
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-700">
          Logged in as{" "}
          <span className="font-semibold">
            {name} ({role})
          </span>
        </div>

        {role === "admin" && (
          <button
            onClick={() => router.push("/admin")}
            className="text-blue-600 font-medium hover:underline"
          >
            Admin Dashboard
          </button>
        )}

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
