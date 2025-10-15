import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ReportView({ id, apiBase }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}/api/reviews/${id}`);
      setReport(res.data);
    } catch (e) {
      console.error(e);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetch();
  }, [id]);

  if (!id) return null;
  if (loading) return <div className="p-4 bg-white rounded shadow">Loading report…</div>;
  if (!report) return <div className="p-4 bg-white rounded shadow">No report found.</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-medium mb-2">{report.title || report.filename}</h3>
      <div className="text-xs text-slate-500 mb-4">Created: {new Date(report.created_at).toLocaleString()}</div>
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(report.report || "") }} />
      </div>
    </div>
  );
}

function markdownToHtml(md) {
  if (!md) return "";
  let html = md
    .replace(/\n/g, "<br/>")
    .replace(/```([\s\S]*?)```/g, (m, code) => `<pre class="p-2 bg-slate-100 rounded"><code>${escapeHtml(code)}</code></pre>`)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
  return html;
}

function escapeHtml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
