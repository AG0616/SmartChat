"use client"
import { useEffect, useRef,useState } from "react"
import { io } from "socket.io-client"
import { useSession } from "next-auth/react"

let socketInstance = null
export default function useSocket(){
    const {data:session}=useSession()
    const socketRef=useRef(null)

    useEffect(()=>{
       if (!session?.user?.id || socketInstance) return
       socketInstance=io(
        process.env.NEXT_PUBLIC_SOCKET_URL,{
            auth:{userId : session.user.id},
            transports: ["websocket"],
        } )

        socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance?.id)
        })

        socketInstance.on("disconnect", () => {
        console.log("Socket disconnected")
        socketInstance = null
        })

        socketRef.current=socketInstance
        return()=>{ }
    },[session?.user?.id])
    return socketRef.current
}