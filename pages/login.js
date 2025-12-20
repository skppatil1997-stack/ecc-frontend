import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      if (res.data.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/player");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #020617, #0f172a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}
    >
      <div style={{ width: "320px" }}>
        <h1 style={{ color: "#f59e0b", textAlign: "center" }}>
          Enthusiast Cricket Club
        </h1>

        <p style={{ textAlign: "center", marginBottom: 20 }}>
          Admin & Player Login
        </p>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}

        <input
             type="email"
             className="w-full px-4 py-2 border rounded
             bg-white text-gray-900
             placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <input
             type="password"
             className="w-full px-4 py-2 border rounded
             bg-white text-gray-900
             placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <button onClick={login} style={btnStyle}>
          Login
        </button>

        {/* SIGN UP BUTTON */}
        <button
          onClick={() => router.push("/signup")}
          style={{ ...btnStyle, background: "#334155", marginTop: 10 }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "4px",
  border: "none"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  background: "#f59e0b",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold"
};
