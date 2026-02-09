'use client'

import { getTrades } from '@/app/actions'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Landing() {
  const [trades, setTrades] = useState<any[]>([])

  useEffect(() => {
    getTrades().then(setTrades)
  }, [])

  const seamlessTrades = [...trades, ...trades]

  return (
    <section
      className="
        w-full flex flex-col items-center
        px-4 sm:px-6
        py-10
        space-y-8
        lg:py-0 lg:space-y-10
        lg:min-h-full lg:justify-center
      "
    >
      <div className="w-full max-w-6xl text-center space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Exchange skills.
          <br />
          <span className="text-black/40">Not money.</span>
        </h1>

        <p className="mx-auto max-w-xs text-sm leading-relaxed text-black/50 sm:max-w-sm">
          A platform where people trade what they know for what they want,
          and grow together.
        </p>

        <div className="flex justify-center">
          <Link
            href="/signup"
            className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.98]"
          >
            Get started
          </Link>
        </div>

        <div className="mx-auto flex max-w-xs flex-wrap justify-center gap-x-2 gap-y-1.5 text-xs text-black/45 sm:max-w-sm">
          <span>Skills over cash</span>
          <span className="opacity-30">•</span>
          <span>Zero payments</span>
          <span className="opacity-30">•</span>
          <span>Direct communication</span>
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <p className="text-center text-xs font-medium tracking-wide text-black/45 sm:text-sm">
          Recently listed skills
        </p>
      </div>

      <div className="relative w-full max-w-6xl overflow-hidden min-h-30 sm:min-h-35">
        {trades.length > 0 && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-24 bg-linear-to-r from-white to-transparent md:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-24 bg-linear-to-l from-white to-transparent md:block" />

            <div className="animate-scroll flex w-max gap-4 px-2 py-2 sm:gap-6 sm:px-4">
              {seamlessTrades.map((trade, index) => (
                <div
                  key={`${trade.id}-${index}`}
                  className="flex w-64 flex-col justify-between rounded-lg border border-black/10 bg-white px-3 py-3 sm:w-72 md:w-80"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {trade.skill_offered}
                      <span className="mx-2 text-black/30">→</span>
                      {trade.skill_wanted}
                    </p>

                    {trade.description && (
                      <p className="mt-2 text-xs leading-relaxed text-black/50">
                        {trade.description}
                      </p>
                    )}
                  </div>

                  <p className="mt-3 text-[11px] text-black/40">
                    {trade.offerer_name?.split(' ')[0]}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
