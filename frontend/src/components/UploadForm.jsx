import React, { useState } from "react";
import axios from "axios";

export default function UploadForm({ apiBase, onSuccess }) {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastReport, setLastReport] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file && !code) {
      alert("Please upload a file or paste code.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      if (file) form.append("file", file);
      if (code) {
        form.append("code", code);
        form.append("filename", "pasted_code.txt");
      }
      if (title) form.append("title", title);
      if (language) form.append("language", language);

      const res = await axios.post(`${apiBase}/api/reviews`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLastReport(res.data);
      onSuccess && onSuccess();
      alert("Review generated and saved (id: " + res.data.id + ")");
    } catch (err) {
      console.error(err);
      alert("Failed to generate review. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-medium mb-2">Upload code or paste</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div>
          <label className="block text-sm mb-1">File</label>
          <input
            type="file"
            accept=".py,.js,.java,.c,.cpp,.ts,.jsx,.tsx,.go,.rs,.rb,.php,.sh,.json,.yaml,.yml,.txt"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Or paste code</label>
          <textarea
            rows="8"
            className="w-full p-2 border rounded font-mono text-sm"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste code here..."
          />
        </div>

        <input
          type="text"
          placeholder="Language (e.g. python, javascript)"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Review"}
          </button>
          {lastReport && (
            <div className="text-sm text-slate-600">Last id: {lastReport.id}</div>
          )}
        </div>
      </form>
    </div>
  );
}
