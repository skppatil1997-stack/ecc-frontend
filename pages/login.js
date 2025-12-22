import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );

      const { token, user } = res.data;

      // 🔐 Store login session
      localStorage.setItem("token", token);
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);

      // 🚦 Role-based redirect
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        {error && (
          <div className="text-red-600 mb-4 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
