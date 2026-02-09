'use client'

import { updateTrade, getTrades } from '@/app/actions'
import { useEffect, useState, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface TradeForm {
    skill_offered: string
    skill_wanted: string
    description: string
}

export default function EditTradePage() {
    const { id } = useParams()
    const router = useRouter()
    const tradeId = Number(id)

    const [form, setForm] = useState<TradeForm>({
        skill_offered: '',
        skill_wanted: '',
        description: '',
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (!tradeId || Number.isNaN(tradeId)) {
            setError('Invalid trade ID')
            setLoading(false)
            return
        }

        let mounted = true

        async function loadTrade() {
            try {
                const trades = await getTrades()
                const trade = trades.find((t: any) => t.id === tradeId)

                if (!trade) {
                    setError('Trade not found')
                    return
                }

                if (!mounted) return

                setForm({
                    skill_offered: trade.skill_offered,
                    skill_wanted: trade.skill_wanted,
                    description: trade.description,
                })
            } catch (err) {
                console.error(err)
                setError('Failed to load trade')
            } finally {
                if (mounted) setLoading(false)
            }
        }

        loadTrade()
        return () => {
            mounted = false
        }
    }, [tradeId])

    function handleSubmit(formData: FormData) {
        setError(null)

        startTransition(async () => {
            try {
                const result = await updateTrade(tradeId, formData)

                if (result?.message && result.message !== 'Updated successfully') {
                    setError(result.message)
                    return
                }

                router.push('/mytrades')
            } catch (err) {
                console.error(err)
                setError('Failed to update trade')
            }
        })
    }

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3 text-black/50">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    <p className="text-sm">Loading trade…</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="py-24 text-center text-sm text-red-600">
                {error}
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-6 sm:py-14 lg:max-w-lg">
            <div className="mb-8 space-y-2 text-center">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Edit trade
                </h1>
                <p className="text-sm text-black/50 sm:text-base">
                    Update what you’re offering or looking for.
                </p>
            </div>

            <form action={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                    <label className="mb-1.5 block text-sm text-black/60 sm:text-base">
                        Skill offered
                    </label>
                    <input
                        name="skill_offered"
                        required
                        defaultValue={form.skill_offered}
                        className="
              w-full rounded-md border border-black/10
              px-3 py-2.5 text-sm
              sm:px-4 sm:py-3 sm:text-base
              focus:border-black focus:outline-none
            "
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm text-black/60 sm:text-base">
                        Skill wanted
                    </label>
                    <input
                        name="skill_wanted"
                        required
                        defaultValue={form.skill_wanted}
                        className="
              w-full rounded-md border border-black/10
              px-3 py-2.5 text-sm
              sm:px-4 sm:py-3 sm:text-base
              focus:border-black focus:outline-none
            "
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm text-black/60 sm:text-base">
                        Description
                    </label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        defaultValue={form.description}
                        className="
              w-full rounded-md border border-black/10
              px-3 py-2.5 text-sm
              sm:px-4 sm:py-3 sm:text-base
              focus:border-black focus:outline-none
              resize-none sm:resize-y
            "
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="
            w-full rounded-md bg-black
            py-3 text-sm font-medium text-white
            sm:py-3.5 sm:text-base
            hover:bg-black/90
            disabled:opacity-60
          "
                >
                    {isPending ? 'Saving…' : 'Save changes'}
                </button>
            </form>
        </div>
    )
}
