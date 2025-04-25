import React, { useState } from "react";
import axios from "axios";

function UserAuth({ clientId, clientSecret, onTokenReceived }) {
  const [externalUserId, setExternalUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/admin/api/auth/token", {
        client_id: clientId,
        client_secret: clientSecret,
        external_userid: externalUserId,
        user_email: userEmail,
      });
      const { access_token } = response.data;
      onTokenReceived(access_token);
    } catch (err) {
      setError("Failed to get auth token. Check credentials.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Get Auth Token</h2>
      <p>Client ID: {clientId}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="External User ID"
          value={externalUserId}
          onChange={(e) => setExternalUserId(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="User Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        <button type="submit">Get Token</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default UserAuth;