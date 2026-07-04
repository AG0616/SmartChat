import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import supabase from "@/lib/db"

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 })
 
  const { data, error } = await supabase
    .from('room_members')
    .select('room_id,rooms(name)')
    .eq('user_id', session?.user?.id)
   
    console.log("data ",data);
    console.log("error ",error);

  if (error) return Response.json({ error }, { status: 500 })
  return Response.json(data)
}
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 })

  const { name } = await req.json()

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .upsert({ name, created_by: session.user.id }, { onConflict: 'name' })
    .select('id')
    .single()

  if (roomError) return Response.json({ error: roomError }, { status: 500 })

  const { error: memberError } = await supabase
    .from('room_members')
    .upsert(
      { room_id: room.id, user_id: session.user.id },
      { onConflict: 'room_id,user_id' }
    )

  if (memberError) return Response.json({ error: memberError }, { status: 500 })

  return Response.json({ id: room.id })
}