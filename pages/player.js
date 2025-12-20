import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Player() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

    socket.on("chat", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, []);

  const send = () => {
    if (!text.trim()) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    socket.emit("chat", { user: "Player", message: text });
    setText("");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Player View</h1>

      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.user}:</strong> {m.message}
          </p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
