'use client'

import { createTrade } from '@/app/actions'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateTradePage() {
    const router = useRouter()

    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(false)

    function handleSubmit(formData: FormData) {
        setError(null)
        setLoading(true)

        startTransition(async () => {
            try {
                const result = await createTrade(null, formData)

                if (result?.message) {
                    setError(result.message)
                    setLoading(false)
                    return
                }

                router.push('/')
            } catch (err) {
                console.error(err)
                setError('Failed to create trade')
                setLoading(false)
            }
        })
    }

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3 text-black/50">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    <p className="text-sm">Creating trade…</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-6 sm:py-14 lg:max-w-lg">
            <div className="mb-8 space-y-2 text-center">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Create trade
                </h1>
                <p className="text-sm text-black/50 sm:text-base">
                    Offer one skill in exchange for another.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form action={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                    <label className="mb-1.5 block text-sm text-black/60 sm:text-base">
                        Skill offered
                    </label>
                    <input
                        name="skill_offered"
                        required
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
                    {isPending ? 'Posting…' : 'Post trade'}
                </button>
            </form>
        </div>
    )
}
