// components/SummaryPanel.jsx
import { useState } from "react";

export default function SummaryPanel({ roomId, lastSeenAt, isOpen, onClose }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, lastSeenAt }),
    });
    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transition-transform z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Catch-Up Summary</h2>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="p-4">
        <button
          onClick={fetchSummary}
          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm mb-3"
        >
          {loading ? "Generating..." : "Generate Summary"}
        </button>
        <p className="text-sm whitespace-pre-line">{summary}</p>
      </div>
    </div>
  );
}