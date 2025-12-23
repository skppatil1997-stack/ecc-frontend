import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function EditTeam() {
  const router = useRouter();
  const { teamId } = router.query;

  const [name, setName] = useState("");
  const [purse, setPurse] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD TEAM DETAILS
     ========================= */
  const loadTeam = async () => {
    try {
      const res = await api.get("/teams");
      const team = res.data.find((t) => t._id === teamId);

      if (!team) {
        alert("Team not found");
        router.push("/admin/teams");
        return;
      }

      setName(team.name);
      setPurse(team.purse);
    } catch (err) {
      alert("Failed to load team details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      loadTeam();
    }
  }, [teamId]);

  /* =========================
     UPDATE TEAM
     ========================= */
  const updateTeam = async () => {
    if (!name || !purse) {
      alert("Team name and purse are required");
      return;
    }

    try {
      await api.put(`/teams/${teamId}`, {
        name,
        purse
      });

      alert("Team updated successfully");
      router.push("/admin/teams");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update team");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 30 }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: 30 }}>
        <button onClick={() => router.back()} style={{ marginBottom: 20 }}>
          ⬅ Back
        </button>

        <h2>Edit Team</h2>

        <div style={{ maxWidth: 400 }}>
          <label>Team Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 15 }}
          />

          <label>Purse (₹)</label>
          <input
            type="number"
            value={purse}
            onChange={(e) => setPurse(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 20 }}
          />

          <button onClick={updateTeam}>Save Changes</button>
        </div>
      </div>
    </>
  );
}
