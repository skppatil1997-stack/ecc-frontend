import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );

      // Save token & role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // Redirect based on role
      if (res.data.user.role === "admin") {
        router.push("/auction");
      } else {
        router.push("/auction"); // player view later
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Enthusiast Cricket Club</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Login
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Welcome back to Enthusiast Cricket Club
          </p>

          {error && (
            <div className="mt-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
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
                className="w-full px-4 py-2 rounded-lg border
                           bg-white text-gray-900
                           placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-green-600"
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
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg border
                           bg-white text-gray-900
                           placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* LOGIN BUTTON */}
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* SIGNUP LINK */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-green-700 font-semibold cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
