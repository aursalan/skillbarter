'use client'

import {
    getTrades,
    getCurrentUser,
    toggleTradeStatus,
    deleteTrade,
} from '@/app/actions'
import { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'

interface Trade {
    id: number
    user_id: number
    skill_offered: string
    skill_wanted: string
    description: string
    status: 'OPEN' | 'CLOSED'
}

export default function MyTradesPage() {
    const [currentUserId, setCurrentUserId] = useState<number | null>(null)
    const [trades, setTrades] = useState<Trade[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let mounted = true

        async function load() {
            try {
                const [userId, allTrades] = await Promise.all([
                    getCurrentUser(),
                    getTrades(),
                ])

                if (!mounted) return

                setCurrentUserId(userId)
                setTrades(allTrades)
            } catch (err) {
                console.error(err)
                setError('Failed to load trades. Please try again.')
            } finally {
                if (mounted) setLoading(false)
            }
        }

        load()
        return () => {
            mounted = false
        }
    }, [])

    const myTrades = useMemo(() => {
        if (!currentUserId) return []
        return trades.filter((t) => t.user_id === currentUserId)
    }, [trades, currentUserId])

    function handleToggleStatus(tradeId: number, current: Trade['status']) {
        const newStatus: Trade['status'] =
            current === 'OPEN' ? 'CLOSED' : 'OPEN'

        setTrades((prev) =>
            prev.map((t) =>
                t.id === tradeId ? { ...t, status: newStatus } : t
            )
        )

        startTransition(async () => {
            try {
                await toggleTradeStatus(tradeId, newStatus)
            } catch (err) {
                setTrades((prev) =>
                    prev.map((t) =>
                        t.id === tradeId ? { ...t, status: current } : t
                    )
                )
                alert('Failed to update trade status.')
            }
        })
    }

    function handleDelete(tradeId: number) {
        const confirmed = confirm('Delete this trade permanently?')
        if (!confirmed) return

        const prevTrades = trades

        setTrades((prev) => prev.filter((t) => t.id !== tradeId))

        startTransition(async () => {
            try {
                await deleteTrade(tradeId)
            } catch (err) {
                setTrades(prevTrades)
                alert('Failed to delete trade.')
            }
        })
    }

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3 text-black/50">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    <p className="text-sm">Loading your trades…</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mx-auto max-w-xl px-4 py-20 text-center text-sm text-red-600">
                {error}
            </div>
        )
    }

    return (
        <div className="mx-auto flex max-w-3xl flex-col px-4 py-14 sm:px-6 lg:max-w-5xl">
            <div className="mb-8 space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">
                    My trades
                </h1>
                <p className="text-sm text-black/50">
                    Manage the skill exchanges you've posted.
                </p>
            </div>

            {myTrades.length === 0 ? (
                <div className="rounded-md border border-dashed border-black/10 bg-black/2 py-10 text-center text-sm text-black/50">
                    You haven't posted any trades yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {myTrades.map((trade) => (
                        <div
                            key={trade.id}
                            className="rounded-md border border-black/10 bg-white px-4 py-4 lg:px-6 lg:py-5"
                        >
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    {trade.skill_offered}
                                    <span className="mx-2 text-black/30">→</span>
                                    {trade.skill_wanted}
                                </p>

                                <p className="text-xs text-black/50">
                                    Status:{' '}
                                    <span
                                        className={
                                            trade.status === 'OPEN'
                                                ? 'text-green-600'
                                                : 'text-black/40'
                                        }
                                    >
                                        {trade.status}
                                    </span>
                                </p>

                                <p className="pt-1 text-sm text-black/60">
                                    {trade.description}
                                </p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <Link
                                    href={`/trade/${trade.id}/edit`}
                                    className="rounded-md border border-black px-3 py-1.5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                                >
                                    Edit
                                </Link>

                                <button
                                    disabled={isPending}
                                    onClick={() =>
                                        handleToggleStatus(trade.id, trade.status)
                                    }
                                    className="rounded-md border border-black/20 px-3 py-1.5 text-sm text-black transition hover:bg-black hover:text-white disabled:opacity-50"
                                >
                                    {trade.status === 'OPEN'
                                        ? 'Close trade'
                                        : 'Reopen trade'}
                                </button>

                                <button
                                    disabled={isPending}
                                    onClick={() => handleDelete(trade.id)}
                                    className="rounded-md border border-red-500 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
