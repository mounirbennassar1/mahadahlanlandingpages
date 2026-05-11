---
name: Tailwind-first styling, CSS only where necessary
description: For the MahaDahlan landingpages repo, prefer Tailwind utilities (arbitrary-value where needed) over custom CSS files. Use CSS only for things Tailwind can't express cleanly — keyframes, pseudo-elements, and selection styling.
type: feedback
---

For new landings and components in the MahaDahlan landingpages repo, use Tailwind utilities first. Fall back to a scoped CSS file only for what Tailwind can't do cleanly: `@keyframes`, `::selection`, and pseudo-element backgrounds (`::after` grain, etc.).

**Why:** The user prefers Tailwind for everything that can be expressed as utilities — keeps styling local to the JSX, avoids the per-landing CSS sprawl that the older landings (dark-circles, hair, hyperpigmentation) suffer from. They're explicit that *both* are allowed when needed, but Tailwind is the default.

**How to apply:**
- Palette tokens go on the landing wrapper as inline `style` (`--color-<prefix>-primary: #...`), not in a CSS rule.
- Read tokens in JSX via Tailwind arbitrary values (`bg-[var(--color-<prefix>-primary)]`) or inline `style` props.
- Gradients, shadows, borders, transforms → Tailwind utilities.
- Animations driven by GSAP/Framer Motion → no CSS needed. Use `gsap.set()` for initial state instead of CSS `transform:` rules.
- Keep `landing.css` lean: only keyframes for infinite-loop animations (marquee), `::selection`, and pseudo-element backgrounds.
- Don't refactor existing landings (dark-circles, hair, hyperpigmentation) preemptively — apply this convention to new work only.
