"use client"
import { useState ,useEffect} from "react";

export default function AIPanel({ mode, roomId, lastSeenAt }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false);

  const isSummary = mode === "summary";
   useEffect(() => {
    setData(null)   
    setLoading(false)
  }, [mode])

  const fetch_ = async () => {
    console.log("wlecome to ai panel");
    
    setLoading(true);
    setData(null);
    setError(null)
    const endpoint = isSummary ? "/api/ai/summary" : "/api/ai/tasks";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, lastSeenAt }),
    });
    if (!res.ok) {
      const text = await res.text()
      setError(text)
      setLoading(false)
      return
    }
    const json = await res.json();
    setData(json);
    console.log("data of summary : ", json);
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <h2 className="font-semibold text-gray-700">
          {isSummary ? "📋 Catch-Up Summary" : "✅ Extracted Tasks"}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {isSummary ? "AI summary of messages you missed" : "Action items from the conversation"}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!data && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <span className="text-4xl">{isSummary ? "📋" : "✅"}</span>
            <p className="text-sm text-gray-500">Click generate to get {isSummary ? "a summary" : "tasks"}</p>
            <button
              onClick={fetch_}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              {isSummary ? "Generate Summary" : "Extract Tasks"}
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">AI is thinking...</p>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center mt-4">⚠️ {error}</p>
        )}
        {/* Summary output */}
        {data && isSummary && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">{data.messageCount} messages summarized</p>
            <div className="bg-indigo-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {data.summary}
            </div>
            <button onClick={fetch_} className="text-xs text-indigo-500 hover:underline">↺ Regenerate</button>
          </div>
        )}

        {/* Tasks output */}
        {data && !isSummary && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">{data.tasks?.length} tasks found</p>
            {data.tasks?.length === 0 && <p className="text-sm text-gray-400">No tasks found in recent messages.</p>}
            {data.tasks?.map((t, i) => (
              <div key={i} className="bg-white border rounded-xl p-3 shadow-sm">
                <p className="text-sm font-medium text-gray-800">{t.task}</p>
                <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
                  {t.assignedTo && <span>👤 {t.assignedTo}</span>}
                  {t.dueDate && <span>📅 {t.dueDate}</span>}
                </div>
              </div>
            ))}
            <button onClick={fetch_} className="text-xs text-indigo-500 hover:underline">↺ Re-extract</button>
          </div>
        )}
      </div>
    </div>
  );
}