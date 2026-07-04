import { useState } from "react";

export default function SearchPanel({ roomId, members }) {
  const [query, setQuery] = useState("");
  const [senderId, setSenderId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch("/api/ai/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, query, senderId: senderId || null }),
    });
    const json = await res.json();
    setResults(json.results || []);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h2 className="font-semibold text-gray-700">🔍 Smart Search</h2>
        <p className="text-xs text-gray-400 mt-0.5">Semantic search across all messages</p>
      </div>

      <div className="p-4 border-b space-y-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder='e.g. "what was decided about the deadline?"'
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-indigo-300 text-white"
        />
        {/* Person filter inside search */}
        <select
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          className="w-full border rounded-lg px-3 py-1.5 text-sm text-gray-600"
        >
          <option value="">All members</option>
          {members?.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <button
          onClick={search}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm"
        >
          Search
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && <p className="text-sm text-gray-400 text-center">Searching...</p>}
        {!loading && results.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-6">
          No matching messages found
        </div>
      )}
        {!loading && results.map((r, i) => (
          <div key={i} className="bg-white border rounded-xl p-3 shadow-sm">
            <p className="text-sm text-gray-800">{r.content}</p>
            <div className="flex justify-between mt-1.5 text-xs text-gray-800">
              <span>👤 {r.user_name}</span>
              <span>{new Date(r.created_at).toLocaleDateString()}</span>
              <span className="text-green-500">{(r.similarity * 100).toFixed(0)}% match</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}