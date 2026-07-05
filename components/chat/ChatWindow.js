"use client"
import { useEffect, useState, useMemo, memo ,useRef } from "react"
import { useSession } from "next-auth/react"
import useSocket from "@/hooks/useSocket"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import AIPanel from "../feature/AIpanel"
import SearchPanel from "../feature/SearchPanel"
import ChatHeader from "./ChatHeader"
import PersonFilter from "./PersonFilter"

const EMOJIS = ["😂", "❤️", "🔥", "✨", "💜", "😍", "🎉", "💫", "🌟", "😎", "🥳", "💥", "🎊", "🌈", "💖"]

const FloatingEmojis = memo(function FloatingEmojis() {
  const [emojiData, setEmojiData] = useState([])

  useEffect(() => {
    setEmojiData(Array.from({ length: 18 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 8}s`,
      size: `${14 + Math.floor(Math.random() * 18)}px`,
      opacity: 0.08 + Math.random() * 0.12,
    })))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {emojiData.map((e) => (  
        <span key={e.id} style={{
          position: "absolute", left: e.left, top: "-40px",
          fontSize: e.size, opacity: e.opacity,
          animation: `fall ${e.duration} ${e.delay} linear infinite`,
        }}>{e.emoji}</span>
      ))}
    </div>
  )
})


export default function ChatWindow({ roomId }) {
  const socket = useSocket()
  const { data: session } = useSession()
  const [messages, setMessages] = useState([])
    const [activePanel, setActivePanel] = useState(null)
  const [members,setMembers]=useState([])

  const lastSeenAt = useRef(new Date(Date.now() - 24*2 * 60 * 60 * 1000).toISOString())
  const panelOpen = !!activePanel

  useEffect(() => {
    if (!socket) return

   socket.emit("join-room", { roomId}) 
   socket.on('previous-messages', (msgs) => {
    setMessages(msgs.map(m => ({
      id: m.id,
      content: m.content,
      senderName: m.users?.name,
      senderImage: m.users?.image,
      senderId: m.user_id,
      createdAt: m.created_at,
    })))
  })
    socket.on('room-members', (members) => setMembers(members))
    socket.on("receive-message", (msg) => setMessages((prev) => [...prev, msg]))

    return () =>{
     socket.off('previous-messages')
    socket.off('receive-message')
    }
  }, [socket, roomId])

  const sendMessage = (content) => {
    if (!socket || !content.trim()) return
    socket.emit("send-message", { roomId, content })
  }

  return (
  <div className="relative flex flex-col h-dvh bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0d1117] font-sans overflow-hidden">
      <FloatingEmojis />

      <ChatHeader  roomId={roomId}   activePanel={activePanel} onPanel={setActivePanel}   onClose={() => setActivePanel(null)} />

      <div className="relative z-10 flex flex-1 min-h-0">
        <div className={`flex flex-col transition-all duration-300 ${panelOpen ? "w-1/2" : "w-full"}`}>
          <MessageList messages={messages} currentUserId={session?.user?.id} />
          <MessageInput onSend={sendMessage} />
        </div>

        {panelOpen && (
          <div className="w-1/2 border-l border-purple-900/40 bg-[#0d0a1a]/80 backdrop-blur flex flex-col transition-all duration-300">

            {(activePanel === "summary" || activePanel === "tasks") && (
              <>
                <div className="flex border-b border-purple-900/40 shrink-0">
                  {["summary", "tasks"].map((m) => (
                    <button key={m} onClick={() => setActivePanel(m)}
                      className={`flex-1 py-2.5 text-xs font-medium transition ${
                        activePanel === m
                          ? "border-b-2 border-violet-500 text-violet-400"
                          : "text-gray-500 hover:text-gray-300"
                      }`}>
                      {m === "summary" ? "📋 Summary" : "✅ Tasks"}
                    </button>
                  ))}
                </div>
                <AIPanel mode={activePanel} roomId={roomId} lastSeenAt={lastSeenAt.current} />
              </>
            )}

            {activePanel === "search" && (
              <SearchPanel roomId={roomId} members={members} />
            )}
          {activePanel === "filter" && (
                      <PersonFilter roomId={roomId} myId={session?.user?.id} members={members} />
                    )}

          </div>
        )}
      </div>
    </div>
  )
}