'use client'

import { useState } from 'react'
import Link from 'next/link'
import { logout } from '@/app/actions'
import { Menu, X } from 'lucide-react'

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto max-w-5xl px-6 h-17 flex items-center justify-between">

                <Link href="/" className="group">
                    <span className="text-[17px] font-medium tracking-tight text-black transition-opacity duration-200 group-hover:opacity-80">
                        Skill
                        <span className="font-semibold ml-px">Barter</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {isLoggedIn ? (
                        <>
                            <form action={logout}>
                                <button
                                    type="submit"
                                    className="text-sm text-black/60 hover:text-black transition"
                                >
                                    Log out
                                </button>
                            </form>

                            <Link
                                href="/create"
                                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 transition"
                            >
                                Post trade
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm text-black/60 hover:text-black transition"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/signup"
                                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 transition"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden rounded-md p-2 text-black/60 hover:text-black transition"
                    aria-label="Toggle navigation"
                >
                    {isOpen ? (
                        <X className="h-5 w-5" strokeWidth={2} />
                    ) : (
                        <Menu className="h-5 w-5" strokeWidth={2} />
                    )}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden border-t border-black/5 bg-white/90 backdrop-blur-xl">
                    <div className="space-y-4 px-6 py-6">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/create"
                                    className="block text-sm font-medium text-black"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Post trade
                                </Link>
                                <form action={logout}>
                                    <button
                                        type="submit"
                                        className="block text-sm text-black/60"
                                    >
                                        Log out
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block text-sm text-black"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="block text-sm text-black"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
