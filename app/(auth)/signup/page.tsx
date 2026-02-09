'use client'

import { signup } from '@/app/actions'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import Link from 'next/link'

function SignupButton() {
    const { pending } = useFormStatus()

    return (
        <button
            disabled={pending}
            className="w-full rounded-md bg-black py-2.5 text-sm font-medium text-white transition hover:bg-black/90 disabled:opacity-50"
        >
            {pending ? 'Creating account…' : 'Create account'}
        </button>
    )
}

export default function SignupPage() {
    const [state, formAction] = useActionState(signup, { message: '' })

    return (
        <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-sm space-y-7">

                <div className="text-center space-y-1.5">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-black/50">
                        Start trading skills today.
                    </p>
                </div>

                <form action={formAction} className="space-y-5">
                    <div>
                        <label className="mb-1.5 block text-sm text-black/60">
                            Full name
                        </label>
                        <input
                            name="name"
                            required
                            placeholder="Your name"
                            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:border-black focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm text-black/60">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="you@gmail.com"
                            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:border-black focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm text-black/60">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            minLength={6}
                            required
                            placeholder="At least 6 characters"
                            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:border-black focus:outline-none"
                        />
                    </div>

                    {state?.message && (
                        <div className="rounded-md bg-red-500/5 px-3 py-2 text-sm text-red-600">
                            {state.message}
                        </div>
                    )}

                    <SignupButton />
                </form>

                <p className="text-center text-sm text-black/50">
                    Already have an account?{' '}
                    <Link href="/login" className="text-black hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}
