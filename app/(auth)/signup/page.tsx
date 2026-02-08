'use client'

import { signup } from '@/app/actions'
import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'

function SignupButton() {
    const { pending } = useFormStatus()

    return (
        <button
            disabled={pending}
            className="w-full rounded-md bg-black py-2.5 text-sm font-medium text-white hover:bg-black/90 transition disabled:opacity-50"
        >
            {pending ? 'Creating account…' : 'Create account'}
        </button>
    )
}

export default function SignupPage() {
    const [state, formAction] = useFormState(signup, { message: '' })

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6">

            <div className="w-full max-w-105 rounded-xl border border-black/5 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-black">
                        Create an account
                    </h1>
                    <p className="mt-1.5 text-sm text-black/60">
                        Start trading skills today.
                    </p>
                </div>

                <form action={formAction} className="space-y-5">

                    <div>
                        <label className="mb-1.5 block text-sm text-black/70">
                            Full name
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="Your name"
                            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm text-black/70">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm text-black/70">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="At least 6 characters"
                            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none transition"
                        />
                    </div>

                    {state?.message && (
                        <div className="rounded-md border border-red-500/10 bg-red-500/5 px-3 py-2 text-sm text-red-600">
                            {state.message}
                        </div>
                    )}

                    <SignupButton />
                </form>

                <p className="mt-6 text-center text-sm text-black/60">
                    Already have an account?{' '}
                    <Link href="/login" className="text-black hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}
