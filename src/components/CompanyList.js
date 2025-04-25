import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [scopes, setScopes] = useState({
    player: {
      getLiveStreams: [],
      getOfflineStreams: [],
    },
    'ext-user' : {
        authenticate : ["POST"],
        refresh : ["GET"]
    }
  });
  const [openModule, setOpenModule] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const availableMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/system");
      setCompanies(response.data.ExtSystem);
    } catch (err) {
      setError("Failed to fetch companies.");
      console.error(err);
    }
  };

  const handleScopeChange = (module, api, method) => {
    setScopes((prev) => {
      const updatedScopes = { ...prev };
      const methods = updatedScopes[module][api];
      if (methods.includes(method)) {
        updatedScopes[module][api] = methods.filter((m) => m !== method);
      } else {
        updatedScopes[module][api] = [...methods, method];
      }
      return updatedScopes;
    });
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/admin/system", {
        name: companyName,
        scopes,
      });
      setCompanyName("");
      setScopes({
        player: {
          getLiveStreams: [],
          getOfflineStreams: [],
        },
      });
      setShowForm(false);
      fetchCompanies();
      navigate(`/company/${response.data.id}`);
    } catch (err) {
      setError("Failed to add company.");
      console.error(err);
    }
  };

  return (
    <div className="company-list">
      <h2>Registered Companies</h2>
      {companies.length > 0 ? (
        companies.map((company) => (
          <div
            key={company.id}
            className="company-item"
            onClick={() => navigate(`/company/${company.id}`)}
          >
            {company.systemName}
          </div>
        ))
      ) : (
        <p>No companies registered yet.</p>
      )}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Company"}
      </button>
      {showForm && (
        <form onSubmit={handleAddCompany}>
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <div className="scopes">
            <h3>Scopes</h3>
            {Object.entries(scopes).map(([module, apis]) => (
              <div key={module} className="module">
                <div onClick={() => setOpenModule(openModule === module ? null : module)}>
                  {module}
                </div>
                {openModule === module && (
                  <div className="dropdown">
                    {Object.entries(apis).map(([api, methods]) => (
                      <div key={api} className="api">
                        <p>{api}</p>
                        {availableMethods.map((method) => (
                          <label key={method} className="method">
                            <input
                              type="checkbox"
                            //   checked={methods.includes(method)}
                              onChange={() => handleScopeChange(module, api, method)}
                            />
                            {method}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button type="submit">Register Company</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CompanyList;