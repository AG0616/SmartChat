import supabase from "@/lib/db";
import { generateEmbedding } from "@/lib/gemini";
import { NextResponse } from "next/server";

export  async function POST(req) {
  const { roomId, query,userId } =await req.json(); 
  const queryEmbedding = await generateEmbedding(query,true);

  const { data, error } = await supabase.rpc("match_messages", {
    query_embedding: queryEmbedding,
    match_room_id: roomId,
    match_sender_id: userId || null,
    match_threshold: 0.7,
    match_count: 10,
  });

 if (error) return NextResponse.json({ error: error.message },{status:500});
  return NextResponse.json({ results: data },{status:200})
}