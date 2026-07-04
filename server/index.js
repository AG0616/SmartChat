await import('dotenv/config')

// dynamic imports for everything — prevents hoisting
const { default: express } = await import('express')
const { createServer } = await import('http')
const { Server } = await import('socket.io')
const { default: registerChatHandlers } = await import('./handlers/chat.js')
const { default: registerRoomHandlers } = await import('./handlers/room.js')



const app=express()
const httpServer=createServer(app)
const io=new Server(httpServer,{
   cors: { origin: "http://localhost:3000", credentials: true } 
})

console.log("io success");

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId
  if (!userId) return next(new Error("unauthorized"))
  socket.userId = userId  
  next()
})

io.on('connection', (socket) => {
  console.log('connected:', socket.userId)

  registerRoomHandlers(io, socket)
  registerChatHandlers(io, socket)

  socket.on('disconnect', () => {
    console.log('disconnected:', socket.userId)
  })
})

httpServer.listen(4000,()=>
console.log('Socket server on :4000')
)