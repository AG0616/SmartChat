import supabase from "@/lib/db";
import { generateText } from "@/lib/gemini";
import { NextResponse } from "next/server";

export  async function POST(req){
     const { roomId, lastSeenAt } = await req.json();
  
    const { data: messages, error } = await supabase.from("messages")
                                    .select("content, created_at, users(name)") 
                                     .eq("room_id", roomId)
                                    .gt("created_at", lastSeenAt).order("created_at", { ascending: true })
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
   if (!messages.length) return NextResponse.json({ summary: "No new messages." })
  
 const conversation = messages.map((m) => `${m.users?.name}: ${m.content}`) .join("\n");
  const prompt = `Summarize this group chat conversation in 4-6 concise bullet points, highlighting key decisions and topics:\n\n${conversation}`;

const summary = await generateText(prompt)
  return NextResponse.json({ summary, messageCount: messages.length })

}