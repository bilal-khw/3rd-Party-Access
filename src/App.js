import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CompanyList from "./components/CompanyList";
import CompanyDetails from "./components/CompanyDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Streaming Auth App</h1>
        <Routes>
          <Route path="/" element={<CompanyList />} />
          <Route path="/company/:id" element={<CompanyDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;