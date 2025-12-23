import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <PageContainer title="Admin Dashboard">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* MANAGE TEAMS */}
          <DashboardCard
            title="Manage Teams"
            description="Create teams, assign purse and captains"
            onClick={() => router.push("/admin/teams")}
          />

          {/* AUCTION PLAYERS */}
          <DashboardCard
            title="Auction Players"
            description="Select players eligible for auction"
            onClick={() => router.push("/admin/players")}
          />

          {/* AUCTION CONTROL */}
          <DashboardCard
            title="Auction Control"
            description="Start auction and control live bidding"
            onClick={() => router.push("/admin/auction")}
          />
        </div>
      </PageContainer>
    </>
  );
}

/* =========================
   DASHBOARD CARD
   ========================= */
function DashboardCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card card-hover"
    >
      <h3 className="mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}
