
import supabase from '../../lib/db.js'
import { generateEmbedding } from '../../lib/gemini.js'

export default function registerChatHandlers(io, socket) {
  socket.on('send-message', async ({ roomId, content }) => {

    const { data, error } = await supabase
      .from('messages')
      .insert({ room_id: roomId, user_id: socket.userId, content})
      .select('*, users(name, image)')
      .single()

    if (error) return console.error('DB error:', error)

    console.log('message saved:', content)

    io.to(roomId).emit('receive-message', {
      id: data.id,
      content: data.content,
      senderName: data.users.name,
      senderImage: data.users.image,
      senderId: socket.userId,
      createdAt: data.created_at,
    })
   generateEmbedding(content,false)
      .then((embedding) =>
        supabase.from('messages').update({ embedding }).eq('id', data.id)
      )
      .catch((err) => console.error('Embedding failed:', err.message))
  
  })
}