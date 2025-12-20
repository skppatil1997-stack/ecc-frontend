import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    adminKey: ""
  });

  const submit = async () => {
    try {
      axios.post(
  `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
  form
);
      alert("Signup successful. Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Signup</h1>

      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} /><br />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} /><br />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} /><br />

      <label>
        <input
          type="checkbox"
          checked={form.isAdmin}
          onChange={e => setForm({ ...form, isAdmin: e.target.checked })}
        />
        Create as Admin
      </label>

      {form.isAdmin && (
        <>
          <br />
          <input
            placeholder="Admin Secret Key"
            onChange={e => setForm({ ...form, adminKey: e.target.value })}
          />
        </>
      )}

      <br />
      <button onClick={submit}>Sign Up</button>
    </div>
  );
}
