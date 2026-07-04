"use client"

import { useEffect, useState, useRef, memo } from "react"


export default function ChatHeader({ roomId, activePanel, onPanel, onClose }) {
  const [aiOpen, setAiOpen] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    const h = (e) => { if (!menuRef.current?.contains(e.target)) setAiOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const toggle = (mode) => {
    activePanel === mode ? onClose() : onPanel(mode)
    setAiOpen(false)
  }

  const btnClass = (mode) =>
    `px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition border ${
      activePanel === mode
        ? "bg-violet-600/30 border-violet-500 text-violet-300"
        : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
    }`

  return (
    <div className="relative z-20 flex items-center gap-3 px-5 py-3 border-b border-purple-900/30 bg-black/40 backdrop-blur-md">
      {/* Room info */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
        {roomId[0].toUpperCase()}
      </div>
      <div>
        <p className="text-white font-semibold text-sm">#{roomId}</p>
        <p className="text-violet-400 text-[11px]">SmartChat</p>
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Live indicator */}
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />

        {/* Search */}
        <button onClick={() => toggle("search")} className={btnClass("search")}>
          🔍 <span>Search</span>
        </button>

        {/* AI Features dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className={`${btnClass(["summary","tasks"].includes(activePanel) ? activePanel : "__")} border border-violet-700/40`}
          >
            ✨ <span>AI</span> <span className="text-[10px]">{aiOpen ? "▲" : "▼"}</span>
          </button>

          {aiOpen && (
            <div className="absolute right-0 top-10 w-52 bg-[#1a0a2e] border border-purple-800/50 rounded-xl shadow-2xl py-1 z-50">
              <button onClick={() => toggle("summary")}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 flex items-start gap-2 text-gray-300">
                <span className="mt-0.5">📋</span>
                <span><strong className="text-white">Summary</strong><br />
                <span className="text-[11px] text-gray-500">Catch up on missed messages</span></span>
              </button>
              <hr className="border-purple-900/50 my-1" />
              <button onClick={() => toggle("tasks")}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 flex items-start gap-2 text-gray-300">
                <span className="mt-0.5">✅</span>
                <span><strong className="text-white">Tasks</strong><br />
                <span className="text-[11px] text-gray-500">Extract action items</span></span>
              </button>
            </div>
          )}
        </div>

        {/* Close panel */}
        {activePanel && (
          <button onClick={onClose} className="ml-1 text-gray-500 hover:text-white text-lg transition">✕</button>
        )}
      </div>
    </div>
  )
}