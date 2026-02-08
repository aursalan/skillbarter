import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="w-full border-t border-black/5 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto max-w-5xl px-6 py-6">
                <div className="flex flex-col items-center gap-4
                        sm:flex-row sm:justify-between sm:gap-0">

                    <p className="text-sm text-black/60">
                        Built by{' '}
                        <span className="font-medium text-black">
                            Aursalan Sayed
                        </span>
                    </p>

                    <div className="flex items-center gap-6">
                        <Link
                            href="https://github.com/aursalan"
                            target="_blank"
                            className="text-sm text-black/50 hover:text-black transition"
                        >
                            GitHub
                        </Link>

                        <Link
                            href="https://www.linkedin.com/in/aursalan-sayed/"
                            target="_blank"
                            className="text-sm text-black/50 hover:text-black transition"
                        >
                            LinkedIn
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
