import React, { useState } from "react";
import axios from "axios";

function CompanyRegistration({ onRegister }) {
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/admin/api/register-company", {
        company_name: companyName,
        contact_email: contactEmail,
      });
      const { client_id, client_secret } = response.data;
      onRegister(client_id, client_secret);
    } catch (err) {
      setError("Failed to register company. Please try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register Company</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Contact Email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CompanyRegistration;