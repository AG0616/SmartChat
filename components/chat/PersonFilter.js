'use client'
import { useState } from 'react'

export default function PersonFilter({ roomId, myId, members, onResults }) {
  const [personId, setPersonId] = useState('')
  const [mode, setMode] = useState('with-me')
  const [timeRange, setTimeRange] = useState('all')
  const [maxGapMinutes, setMaxGapMinutes] = useState(60)
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({ replied: [], all: [] })

  const applyFilter = async () => {
    if (!personId) return
    setLoading(true)
    try {
      const res = await fetch('/api/person_filter', {
        method: 'POST',
        body: JSON.stringify({ roomId, personId, myId, mode, timeRange, maxGapMinutes }),
      })
      const data = await res.json()
      setResults(data.results)
      onResults?.(data.results)
    } catch (err) {
      console.error('Filter failed:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const displayMessages = showAll ? results.all : results.replied

  return (
    <div className="p-3 bg-white border rounded-xl space-y-2">
      <select value={personId} onChange={(e) => setPersonId(e.target.value)} className="w-full border rounded p-1.5 text-sm">
        <option value="">Select person</option>
        {members?.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full border rounded p-1.5 text-sm">
        <option value="with-me">Chat with me</option>
        <option value="only-person">Only their messages</option>
      </select>

      <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="w-full border rounded p-1.5 text-sm">
        <option value="all">All time</option>
        <option value="week">Last 1 week</option>
        <option value="month">Last 1 month</option>
      </select>

      {mode === 'with-me' && (
        <input type="number"  value={maxGapMinutes}  onChange={(e) => setMaxGapMinutes(Number(e.target.value))}
                 placeholder="Reply gap (minutes)"  className="w-full border rounded p-1.5 text-sm"  />
      )}

      <button onClick={applyFilter} className="w-full bg-blue-500 text-white rounded p-1.5 text-sm">
        {loading ? 'Loading...' : 'Apply Filter'}
      </button>

      {mode === 'with-me' && results.all.length > 0 && (
        <button onClick={() => setShowAll(!showAll)} className="text-xs text-blue-500">
          {showAll ? 'Show only replies' : 'Show all messages'}
        </button>
      )}

      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {displayMessages.map((m) => (
          <div key={m.id} className="text-sm border-b py-1">
            <span className="font-medium">{m.users?.name}: </span>
            {m.content}
            <span className="text-xs text-gray-400 block">{new Date(m.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}