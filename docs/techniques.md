# Optimization techniques, mapped to the metric each one moves

| Technique                                                           | File                                                           | Primarily improves                                               |
| ------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- |
| Drop `moment` and full `lodash` for native `Intl` + a one-line sort | `src/fast/App.tsx`, `src/shared/format.ts`                     | Bundle size, FCP/LCP (less JS to download, parse, execute)       |
| List virtualization (render only the visible window)                | `src/fast/useVirtualRows.ts`, `src/fast/TransactionsTable.tsx` | TBT/INP, LCP (DOM of ~30 rows instead of ~5000)                  |
| Memoize filtering and summary on their inputs                       | `src/fast/App.tsx` (`useMemo`)                                 | TBT/INP (no recompute on unrelated renders)                      |
| `useDeferredValue` for the search box                               | `src/fast/App.tsx`                                             | INP (keystrokes stay responsive; filtering runs at low priority) |
| `memo` the table                                                    | `src/fast/TransactionsTable.tsx`                               | INP (skips re-render while the deferred value settles)           |
| Code-split the breakdown widget                                     | `src/fast/App.tsx` (`lazy`/`Suspense`)                         | FCP (initial chunk does not include it)                          |

## The naive version, for contrast

`src/slow/App.tsx` does the opposite of each of the above, on purpose and with comments: eager `moment`/`lodash`, all rows in the DOM, everything recomputed every render (including a deliberately expensive aggregation in `src/slow/insights.ts`), and synchronous search state.

## How the measurement works

`scripts/measure.mjs` builds both apps, serves the production output, and runs Lighthouse (mobile profile: 4× CPU throttle, Slow 4G) `RUNS` times per page, recording the **median** so one noisy run cannot skew the result. Bundle bytes come from the Vite manifest (initial chunk + its static imports) and are cross-checked against Lighthouse's own network transfer total. The dataset is seeded (`src/shared/data.ts`), so every run compares identical work.
