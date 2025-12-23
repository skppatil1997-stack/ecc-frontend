import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

export default function AdminTeams() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD TEAMS
     ========================= */
  const loadTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      alert("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  /* =========================
     DELETE TEAM
     ========================= */
  const deleteTeam = async (teamId) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      await api.delete(`/teams/${teamId}`);
      loadTeams();
    } catch (err) {
      alert("Failed to delete team");
    }
  };

  return (
    <>
      <Navbar />

      <PageContainer title="Manage Teams">
        {/* CREATE TEAM */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin/create-team")}
            className="btn btn-primary"
          >
            + Create Team
          </button>
        </div>

        {loading && <p>Loading teams...</p>}

        {!loading && teams.length === 0 && (
          <p className="text-slate-500">No teams created yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div key={team._id} className="card">
              {/* HEADER */}
              <div className="flex justify-between items-start mb-3">
                <h3>{team.name}</h3>
                <span className="text-sm text-slate-500">
                  ₹{team.purse}
                </span>
              </div>

              {/* DETAILS */}
              <p className="mb-4">
                <strong>Captain:</strong>{" "}
                {team.captain ? team.captain.name : "Not Assigned"}
              </p>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    router.push(`/admin/edit-team?teamId=${team._id}`)
                  }
                >
                  Edit Team
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    router.push(
                      `/admin/assign-captain?teamId=${team._id}`
                    )
                  }
                >
                  {team.captain ? "Change Captain" : "Assign Captain"}
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => deleteTeam(team._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </>
  );
}
