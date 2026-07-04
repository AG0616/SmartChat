import supabase  from "@/lib/db";
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

  const conversation = messages.map((m) => `${m.users?.name}: ${m.content}`).join("\n");

  const prompt = `
                Extract action items / tasks from this conversation.
                Return ONLY valid JSON array, no markdown, no explanation:
                [{"task": "...", "assignedTo": "name or null", "dueDate": "date or null"}]

                Conversation:
                ${conversation}`;

  const raw = await generateText(prompt);

  let tasks = [];
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    tasks = JSON.parse(cleaned);
  } catch (e) {
    console.error("Task parse failed:", raw);
  }

 return NextResponse.json({tasks},{status:200})
}