import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          name,
          email,
          password,
          isAdmin,
          adminKey
        }
      );

      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Signup | Enthusiast Cricket Club</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Create Account
          </h1>

          {error && (
            <div className="mt-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="mt-6 space-y-4">

            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-green-600"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-green-600"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-green-600"
              />
            </div>

            {/* ADMIN OPTION */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <span className="text-sm text-gray-700">
                Sign up as Admin
              </span>
            </div>

            {isAdmin && (
              <input
                type="password"
                placeholder="Admin Secret Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition
                ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800"
                }`}
            >
              {loading ? "Creating Account..." : "Signup"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
