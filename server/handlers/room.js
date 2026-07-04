import supabase from '../../lib/db.js'

export default function registerRoomHandlers(io, socket) {
  socket.on("join-room", async({ roomId }) => {
    socket.join(roomId)
    console.log(`${socket.userId} joined the room ${roomId}`)

    const { error: memberError }= await supabase.from('room_members')
    .upsert({ room_id: roomId, user_id: socket.userId }, { onConflict: 'room_id,user_id' })

      if (memberError) console.error('room_members error:', memberError)

    const {data,error}=await supabase.from('messages').select('*,users(name,image)')
                      .eq("room_id",roomId).order("created_at",{ascending:true})
                      .limit(100)
     if (error) return console.error('fetch messages error:', error)
    socket.emit('previous-messages', data)
  })
 
  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId)
  })
}