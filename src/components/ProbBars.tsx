import React from 'react'

type ProbBarsProps = {
  /** Array of length 10 with probabilities in [0,1] for digits 0..9 */
  probs?: number[] | null
  /** Optional: show a header label */
  title?: string
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

const ProbBars: React.FC<ProbBarsProps> = ({ probs, title = 'Model confidence' }) => {
  const values = (probs && probs.length === 10) ? probs.map(clamp01) : Array(10).fill(0)
  const topIdx = values.reduce((best, v, i) => (v > values[best] ? i : best), 0)

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 text-sm font-semibold text-gray-700">{title}</div>
      <div className="space-y-5 md:space-y-3">
        {values.map((p, i) => {
          const pct = Math.round(p * 1000) / 10 // one decimal place
          const isTop = i === topIdx && p > 0
          return (
            <div
              key={i}
              className="flex flex-row items-center gap-2"
            >
              <div className="w-4 text-xs text-gray-600 text-left">{i}</div>
              <div className="w-full h-4 rounded bg-gray-200 overflow-hidden">
                <div
                  className={`h-4 rounded ${isTop ? 'bg-blue-500' : 'bg-blue-300'}`}
                  style={{ width: `${pct}%`, transition: 'width 150ms linear' }}
                  aria-label={`Digit ${i} probability ${pct}%`}
                />
              </div>
              <div className="w-4 text-right text-xs tabular-nums text-gray-600 sm:text-right text-left">{pct.toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProbBars
