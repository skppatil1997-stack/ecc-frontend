import { useEffect, useState } from "react";
import axios from "axios";

export default function Auction() {
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/public/auction`)
      .then((res) => setAuction(res.data));
  }, []);

  if (!auction)
    return <h2 style={{ padding: 40 }}>No auction started yet</h2>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Live Auction</h1>
      {auction.currentPlayer ? (
        <>
          <h2>{auction.currentPlayer.name}</h2>
          <p>Current Bid: ₹{auction.currentBid}</p>
        </>
      ) : (
        <p>Auction not running</p>
      )}
    </div>
  );
}
