import ReactMarkdown from 'react-markdown'

/**
 * The seven window fields that carry vault Markdown, rendered: `nervous.text`,
 * `sun_reading`, `earth_reading`, `bridge.text`, `lookback.text`, `axis.lead`,
 * and `practice.text`.
 *
 * Phase 1 deliberately passes this prose through unconverted — assembling data
 * and deciding presentation are separate jobs. This is where the second one
 * happens.
 *
 * Colours come through the typography plugin's own `--tw-prose-*` variables
 * rather than a stack of `prose-p:` overrides, so a field that turns out to
 * contain a heading or a link is styled too instead of falling back to the
 * plugin's default grey.
 */

const TONE = [
  '[--tw-prose-body:var(--color-rbd-text)]',
  '[--tw-prose-headings:var(--color-rbd-ink)]',
  '[--tw-prose-bold:var(--color-rbd-ink)]',
  '[--tw-prose-counters:var(--color-rbd-ember)]',
  '[--tw-prose-bullets:var(--color-rbd-terracotta)]',
  '[--tw-prose-links:var(--color-rbd-ember)]',
  '[--tw-prose-quotes:var(--color-rbd-muted)]',
  '[--tw-prose-quote-borders:var(--color-rbd-sage-light)]',
  '[--tw-prose-hr:var(--color-rbd-line)]',
].join(' ')

// Clara writes practices as a framing paragraph then a numbered list of
// elements, each a full paragraph long. The plugin's default list rhythm is
// tuned for short items and runs them together at that length, so counters get
// their own line-height and items get real separation.
const LISTS = [
  'prose-ol:mt-5 prose-ol:space-y-5 prose-ol:ps-6',
  'prose-ul:mt-3 prose-ul:space-y-2 prose-ul:ps-5',
  'prose-li:ps-1.5 prose-li:leading-relaxed',
  'marker:font-display marker:font-medium',
].join(' ')

export default function Markdown({
  children,
  lead = false,
}: {
  children: string
  /** Hero sizing — the practice block and anything else carrying the page. */
  lead?: boolean
}) {
  return (
    <div
      className={`prose max-w-none prose-stone ${lead ? 'prose-base' : 'prose-sm'} ${TONE} ${LISTS}
        prose-p:leading-[1.75] prose-strong:font-medium prose-em:font-serif prose-em:italic`}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  )
}
