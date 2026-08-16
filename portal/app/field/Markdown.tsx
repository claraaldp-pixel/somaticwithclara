import ReactMarkdown from 'react-markdown'

/**
 * The six window fields that carry vault Markdown, rendered.
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
