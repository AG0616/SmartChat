// components/TaskPanel.jsx
import { useState } from "react";

export default function TaskPanel({ roomId, lastSeenAt, isOpen, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, lastSeenAt }),
    });
    const data = await res.json();
    setTasks(data.tasks || []);
    setLoading(false);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transition-transform z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Extracted Tasks</h2>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="p-4">
        <button
          onClick={fetchTasks}
          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm mb-3"
        >
          {loading ? "Extracting..." : "Extract Tasks"}
        </button>
        <ul className="space-y-2 text-sm">
          {tasks.map((t, i) => (
            <li key={i} className="border-b pb-2">
              <p>{t.task}</p>
              <p className="text-xs text-gray-500">
                {t.assignedTo || "Unassigned"} {t.dueDate ? `· ${t.dueDate}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}