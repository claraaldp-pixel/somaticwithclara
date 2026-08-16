import ReactMarkdown from 'react-markdown'

/**
 * The seven window fields that carry vault Markdown, rendered: `nervous.text`,
 * `sun_reading`, `earth_reading`, `bridge.text`, `lookback.text`, `axis.lead`,
 * and `practice.text`.
 *
 * Phase 1 deliberately passes this prose through unconverted — assembling data
 * and deciding presentation are separate jobs. This is where the second one
 * happens.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-stone prose-sm max-w-none
      prose-p:leading-relaxed prose-p:text-stone-700
      prose-li:text-stone-700 prose-li:leading-relaxed
      prose-strong:font-medium prose-strong:text-stone-800
      prose-em:text-stone-600">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  )
}
