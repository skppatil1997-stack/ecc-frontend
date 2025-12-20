import axios from "axios";

export default function Admin() {
  const startAuction = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/auction/start`,
      {},
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    alert("Auction started");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>
      <button onClick={startAuction}>Start Auction</button>
    </div>
  );
}
