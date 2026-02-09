'use client'

import { getTrades, getCurrentUser } from '@/app/actions'
import { useEffect, useMemo, useState } from 'react'

interface Trade {
  id: number
  user_id: number
  user_name: string
  user_email: string
  skill_offered: string
  skill_wanted: string
  description: string
  status: 'OPEN' | 'CLOSED'
}

export default function ExplorePage() {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUser()
      const tradesData = await getTrades()

      setCurrentUserId(userId)
      setTrades(tradesData)
      setLoading(false)
    }

    load()
  }, [])

  const exploreTrades = useMemo(() => {
    if (currentUserId === null) return []

    const q = query.toLowerCase().trim()

    return trades.filter((trade) => {
      if (trade.user_id === currentUserId) return false

      if (trade.status !== 'OPEN') return false

      if (!q) return true

      return (
        trade.skill_offered.toLowerCase().includes(q) ||
        trade.skill_wanted.toLowerCase().includes(q) ||
        trade.description.toLowerCase().includes(q) ||
        trade.user_name.toLowerCase().includes(q)
      )
    })
  }, [trades, currentUserId, query])

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-black/40 animate-pulse">
        Loading exchanges…
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-14 sm:px-6 lg:max-w-5xl">
      <div className="mb-8 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Explore exchanges
        </h1>
        <p className="text-sm text-black/50">
          Open trades from the community. Click to reach out directly.
        </p>
      </div>

      <div className="mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills or people"
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:border-black focus:outline-none"
        />
      </div>

      {exploreTrades.length === 0 ? (
        <div className="rounded-md border border-dashed border-black/10 bg-black/2 py-10 text-center text-sm text-black/50">
          {query
            ? 'No open trades match your search.'
            : 'No open trades available right now.'}
        </div>
      ) : (
        <div className="space-y-4">
          {exploreTrades.map((trade) => (
            <div
              key={trade.id}
              className="rounded-md border border-black/10 bg-white px-4 py-4 lg:px-6 lg:py-5"
            >
              <div className="lg:flex lg:items-start lg:justify-between lg:gap-6">
                <div className="space-y-2 lg:max-w-[70%]">
                  <p className="text-sm font-medium">
                    {trade.skill_offered}
                    <span className="mx-2 text-black/30">→</span>
                    {trade.skill_wanted}
                  </p>

                  <p className="text-xs text-black/50">
                    by {trade.user_name.split(' ')[0]}
                  </p>

                  <p className="pt-1 text-sm text-black/60">
                    {trade.description}
                  </p>
                </div>

                <div className="mt-4 lg:mt-0 lg:flex lg:items-center">
                  <a
                    href={`mailto:${trade.user_email}?subject=Skill%20Exchange%20via%20SkillBarter&body=Hi%20${trade.user_name.split(' ')[0]},%0A%0AI%20saw%20your%20skill%20exchange%20post%20on%20SkillBarter%20and%20would%20love%20to%20connect.%0A%0AThanks!`}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90"
                  >
                    Send mail
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
