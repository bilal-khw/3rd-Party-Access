import React, { useState } from "react";
import axios from "axios";

function StreamingAccess({ accessToken }) {
  const [streamId, setStreamId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleJoinStream = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:4000/api/admin/streaming/join?stream_id=${streamId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setMessage(response.data.message || "Successfully joined stream!");
      setError("");
    } catch (err) {
      setError("Failed to join stream. Token may be invalid or expired.");
      setMessage("");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Access Streaming</h2>
      <p>Access Token: {accessToken}</p>
      <form onSubmit={handleJoinStream}>
        <input
          type="text"
          placeholder="Stream ID"
          value={streamId}
          onChange={(e) => setStreamId(e.target.value)}
          required
        />
        <button type="submit">Join Stream</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default StreamingAccess;