import React from "react";

export default function ReportsList({ reports, onSelect, refresh }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Recent Reports</h3>
        <button onClick={refresh} className="text-sm underline">Refresh</button>
      </div>
      <ul className="space-y-2 max-h-[60vh] overflow-auto">
        {reports.length === 0 && <li className="text-sm text-slate-500">No reports yet.</li>}
        {reports.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => onSelect(r.id)}
              className="w-full text-left p-2 rounded hover:bg-slate-50"
            >
              <div className="font-medium">{r.title || r.filename}</div>
              <div className="text-xs text-slate-500">{r.filename} · {new Date(r.created_at).toLocaleString()}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
