"use client"
import { useEffect, useRef } from "react"

export default function MessageList({ messages, currentUserId }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-2 min-h-0">
      {messages.length === 0 && (
        <p className="text-center text-violet-400/50 text-sm mt-10">
          No messages yet — say something!
        </p>
      )}
      {messages.map((msg) => {
        const isOwn = msg.senderId === currentUserId
        return (
          <div key={msg.id} className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
            {!isOwn && (
              <span className="text-[13px] text-pink-400 font-medium pl-3">
                {msg.senderName}
              </span>
            )}
            <div className={`max-w-[70%] px-4 py-2 text-sm leading-relaxed break-words text-white
              ${isOwn
                ? "bg-gradient-to-br from-violet-600 to-pink-600 rounded-[18px_18px_4px_18px] "
                : "bg-white/10 border border-violet-500/20 rounded-[18px_18px_18px_4px]"
              }`}>
             {msg.content}
            </div>
            <span className="text-[10px] text-violet-400/40 px-3">
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : ""}
            </span>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}