import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [externalUserId, setExternalUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    fetchCompanyDetails();
    fetchUsers();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/admin/system?id=${id}`);
      setCompany(response.data.ExtSystem);
    } catch (err) {
      setError("Failed to fetch company details.");
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/admin/system/${id}/users`);
      setUsers(response.data.ExtSystemUsers);
    } catch (err) {
      setError("Failed to fetch users.");
      console.error(err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/system", {
        client_id: company.client_id,
        client_secret: company.client_secret,
        external_userid: externalUserId,
        user_email: userEmail,
      });
      setAccessToken(response.data.access_token);
      setExternalUserId("");
      setUserEmail("");
      setShowUserForm(false);
      fetchUsers();
    } catch (err) {
      setError("Failed to add user or get token.");
      console.error(err);
    }
  };

  if (!company) return <p>Loading...</p>;

  return (
    <div className="details">
      <h2>{company.name}</h2>
      <p>Client ID: {company.client_id}</p>
      <p>Client Secret: {company.client_secret}</p>
      <h3>Scopes</h3>
      <pre>{JSON.stringify(company.scopes, null, 2)}</pre>

      <h3>Users</h3>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.external_userid}>
              {user.user_email} (ID: {user.external_userid})
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}

      <button onClick={() => setShowUserForm(!showUserForm)}>
        {showUserForm ? "Cancel" : "Add User"}
      </button>

      {showUserForm && (
        <form onSubmit={handleAddUser}>
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
          <button type="submit">Get Access Token</button>
        </form>
      )}

      {accessToken && (
        <p>
          Access Token: <strong>{accessToken}</strong>
        </p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CompanyDetails;