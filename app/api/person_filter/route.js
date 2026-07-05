import supabase from '../../../lib/db.js'
import { NextResponse } from 'next/server'

function filterActiveExchanges(messages, maxGapMinutes) {
  if (messages.length === 0) return { replied: [], all: [] }

  const replied = []

  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1]
    const curr = messages[i]

    const gapMinutes = (new Date(curr.created_at) - new Date(prev.created_at)) / (1000 * 60)
    const userSwitched = prev.user_id !== curr.user_id

    if (userSwitched && gapMinutes <= maxGapMinutes) {
      if (!replied.includes(prev)) replied.push(prev)
      if (!replied.includes(curr)) replied.push(curr)
    }
  }

  return { replied, all: messages }
}

export async function POST(req) {
  const { roomId, personId, myId, mode, timeRange, maxGapMinutes } = await req.json()

  let query = supabase .from('messages')
             .select('*, users(name, image)')
            .eq('room_id', roomId)
            .order('created_at', { ascending: true })

  if (mode === 'only-person') {
    query = query.eq('user_id', personId)
  } else if (mode === 'with-me') {
    query = query.in('user_id', [personId, myId])
  }

  if (timeRange === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    query = query.gte('created_at', weekAgo)
  } else if (timeRange === 'month') {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    query = query.gte('created_at', monthAgo)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = mode === 'with-me'
    ? filterActiveExchanges(data, maxGapMinutes || 60)
    : { replied: data, all: data }

  return NextResponse.json({ results }, { status: 200 })
}