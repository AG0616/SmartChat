"use client"
import { useState } from "react"

export default function MessageInput({ onSend }) {
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput("")
  }

  return (
    <div className="px-4  py-3 max-w-[80%] ml-[10%] border-t border-purple-900/30 bg-black/60 rounded-4xl backdrop-blur-md">
      <div className="flex items-center gap-3 bg-white/5 border border-violet-500/20 rounded-full px-5 py-2 focus-within:border-violet-500/50 transition-colors">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-violet-400/40 min-w-0"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all
            bg-gradient-to-br from-violet-600 to-pink-600 text-white
            disabled:opacity-30 disabled:cursor-not-allowed
            hover:scale-105 active:scale-95"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}