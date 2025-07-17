import React, { useEffect, useState } from "react";

export default function UserMessage() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/user-message", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => data.message && setMsg(data.message));
  }, []);

  if (!msg) return null;

  return (
    <div style={{
      background: "#fef3c7",
      padding: "1rem",
      margin: "1rem",
      border: "1px solid #fcd34d",
      borderRadius: "8px"
    }}>
      <strong>💌 New Message:</strong>
      <p>{msg}</p>
    </div>
  );
}
