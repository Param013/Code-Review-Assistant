import React, { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import ReportsList from "./components/ReportsList";
import ReportView from "./components/ReportView";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function App() {
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/reviews`);
      setReports(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Code Review Assistant</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <UploadForm onSuccess={() => fetchReports()} apiBase={API_BASE} />
          {selectedReportId ? (
            <ReportView id={selectedReportId} apiBase={API_BASE} />
          ) : (
            <div className="p-4 bg-white rounded shadow">
              <p className="text-slate-600">Select a report from the right to view details.</p>
            </div>
          )}
        </div>

        <div>
          <ReportsList
            reports={reports}
            onSelect={(id) => setSelectedReportId(id)}
            refresh={() => fetchReports()}
          />
        </div>
      </div>
    </div>
  );
}
