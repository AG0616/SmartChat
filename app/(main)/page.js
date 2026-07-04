"use client"
import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Page() {
  const { data: session, status } = useSession()
  const [groups, setGroups] = useState([])
  const [roomName, setRoomName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!session) return
    fetch("/api/rooms")
      .then(res => res.json())
      .then(data => setGroups(data))
  }, [session])

  const handleJoinOrCreate = async () => {
    if (!roomName.trim()) return
    setLoading(true)
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: roomName.trim().toLowerCase() })
    })
    const { id } = await res.json()
    setLoading(false)
    setRoomName("")
    router.push(`/chat/${id}`)  // redirect to room directly
  }

  if (status === "loading") return <p className="text-white p-4">Loading...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0d1117] text-white">
      {/* Header */}
      <div className="flex justify-between items-center mx-[5%] py-4 border-b border-violet-900/30">
        <h1 className="text-xl font-bold text-violet-300">SmartChat</h1>
        {session ? (
          <div className="flex items-center gap-3">
            <img src={session.user.image} className="w-8 h-8 rounded-full" />
            <span className="text-sm text-violet-300">{session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="border border-pink-500/50 rounded-xl py-1 px-4 text-sm text-pink-400 hover:bg-pink-500/20 transition-colors">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="border border-violet-500 rounded-xl py-1 px-4 text-sm hover:bg-violet-500/20 transition-colors">
            Login with Google
          </button>
        )}
      </div>

      {!session ? (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
          <p className="text-violet-300 text-lg">Login to see your groups</p>
          <button
            onClick={() => signIn("google")}
            className="bg-gradient-to-br from-violet-600 to-pink-600 px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="mx-[5%] mt-6 flex flex-col gap-6">

          {/* Join / Create */}
          <div className="bg-white/5 border border-violet-500/20 rounded-2xl p-5 flex flex-col gap-3">
            <h2 className="text-sm font-medium text-violet-300">Join or Create a Room</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinOrCreate()}
                placeholder="Enter room name..."
                className="flex-1 bg-white/5 border border-violet-500/20 rounded-xl px-4 py-2 text-sm text-white placeholder:text-violet-400/40 outline-none focus:border-violet-500/50"
              />
              <button
                onClick={handleJoinOrCreate}
                disabled={!roomName.trim() || loading}
                className="bg-gradient-to-br from-violet-600 to-pink-600 px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity">
                {loading ? "..." : "Join"}
              </button>
            </div>
          </div>

          {/* Groups list */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm text-violet-400">Your Rooms</h2>
            {groups.length === 0 && (
              <p className="text-violet-400/40 text-sm">No rooms yet — create one above</p>
            )}
            {groups.map((g) => (
              <Link
                key={g.room_id}
                href={`/chat/${g.room_id}`}
                className="px-4 py-3 bg-white/5 border border-violet-500/20 rounded-xl hover:bg-violet-500/10 transition-colors text-sm flex items-center gap-2">
                <span className="text-violet-400">#</span>
                {g.rooms?.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}