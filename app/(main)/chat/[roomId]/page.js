import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ChatWindow from "@/components/chat/ChatWindow"

export default async function ChatPage({params}){
    const p=await params
    const session=await getServerSession(authOptions)
    if(!session) redirect("/api/auth/signin")
   
        return <ChatWindow roomId={p.roomId}/>
}