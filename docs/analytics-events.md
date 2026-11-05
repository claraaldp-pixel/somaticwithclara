# Umami event map

The Umami script records pageviews automatically. `site-events.js` adds interaction events on active public pages. The tracker runs only on `www.somaticwithclara.com` and `somaticwithclara.com`, so local and Vercel preview traffic does not enter production reports.

| Event | Meaning |
| --- | --- |
| `booking-click` | A visitor clicks a Cal.com booking link. `destination` distinguishes `single-session` from `three-month-coaching`. This is a booking *intent*, not a completed booking. |
| `guide-click` | A visitor clicks a link to the free guide. |
| `guide-form-submit-attempt` | The embedded MailerLite guide form fires a submit event. This does not confirm a successful signup. |
| `contact-click` | A visitor clicks an email link. |
| `outbound-click` | A visitor clicks a link to another service, such as Insight Timer or Instagram. |
| `navigation-click` | A visitor clicks another internal link. |
| `quiz-start-click`, `quiz-next-click`, `quiz-skip`, `quiz-retake`, `quiz-questions-complete`, `quiz-result-request`, `quiz-result-view` | Non-sensitive quiz progress and actions. |
| `reflection-result-view` | A visitor reaches a reflection quiz result. |
| `accordion-open` | A FAQ or credentials panel opens. |
| `menu-toggle`, `modal-open`, `modal-close`, `button-click` | Other on-page controls. |

Most events include `page` and `location`; link events include a safe `destination` label. No form field values, quiz answers, names, or email addresses are passed in event data. Existing `data-umami-event` names on the bio-links page are preserved and skipped by the new click handler to avoid duplicate events.

Cal.com booking completion and MailerLite signup success happen in external services and are not measured by these website events. Use those services' own reports for completed actions.
