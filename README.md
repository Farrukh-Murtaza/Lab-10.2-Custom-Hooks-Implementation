# Custom Hooks Lab

A small React + TypeScript lab demonstrating how to build **reusable custom hooks** and consume them in clean, real-world demos.

Currently includes:

- 🏠 **Home Page** — landing page to navigate between demos
- 🧭 **`usePagination`** — a bounds-safe pagination hook
- 🔍 **`useDebounce`** — a value debouncing hook with a live API search demo

---

## 📦 What's Inside

```
src/
├── hooks/
│   ├── usePagination.ts        # Pagination hook
│   └── useDebounce.ts          # Debounce hook
├── pages/
│   ├── HomePage.tsx            # Landing page
│   ├── PaginationDemo.tsx      # Pagination demo
│   └── DebounceSearch.tsx      # Debounced API search demo
├── App.tsx                     # Routes
└── main.tsx
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open the printed URL (usually `http://localhost:5173`).

You'll land on the **Home Page** with two buttons:

- **Pagination** → `/pagination`
- **Debounce Search** → `/debounce-search`

---

## 🏠 Home Page

A minimal landing page with two navigation buttons.

```tsx
<Link to="/pagination">Pagination</Link>
<Link to="/debounce-search">Debounce Search</Link>
```

Styled with a centered card, gradient background, and icons for each demo.

---

## 🧭 Hook #1 — `usePagination`

### Purpose
Everything you need to paginate a list of items: current page, total pages, index bounds, navigation controls, and boundary flags.

### Signature

```ts
usePagination({
  totalItems: number,
  itemsPerPage?: number,   // default: 10
  initialPage?: number,    // default: 1
}): UsePaginationReturn
```

### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `totalItems` | `number` | — | Total number of items to paginate |
| `itemsPerPage` | `number` | `10` | Items per page |
| `initialPage` | `number` | `1` | Page to start on |

### Returns

| Name | Type | Description |
|------|------|-------------|
| `currentPage` | `number` | Current active page (1-based, always clamped) |
| `totalPages` | `number` | Total pages (`Math.ceil(totalItems / itemsPerPage)`) |
| `startIndex` | `number` | **0-based** start index for slicing |
| `endIndex` | `number` | **0-based** exclusive end index for slicing |
| `itemsOnCurrentPage` | `number` | Actual count on the current page (handles partial last page) |
| `setPage` | `(page: number) => void` | Jump to a page (clamped) |
| `nextPage` | `() => void` | Go to next page (no-op on last) |
| `prevPage` | `() => void` | Go to previous page (no-op on first) |
| `canNextPage` | `boolean` | `true` if a next page exists |
| `canPrevPage` | `boolean` | `true` if a previous page exists |

### Usage Example

```tsx
import { usePagination } from "../hooks/usePagination";

const ITEMS = Array.from({ length: 123 }, (_, i) => `Item ${i + 1}`);

function MyList() {
    const {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        itemsOnCurrentPage,
        setPage,
        nextPage,
        prevPage,
        canNextPage,
        canPrevPage,
    } = usePagination({ totalItems: ITEMS.length, itemsPerPage: 10 });

    const visibleItems = ITEMS.slice(startIndex, endIndex);

    return (
        <>
            <ul>
                {visibleItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>

            <p>
                Showing {startIndex + 1}–{endIndex} of {ITEMS.length} •{" "}
                Page {currentPage} of {totalPages} •{" "}
                {itemsOnCurrentPage} items on this page
            </p>

            <button onClick={prevPage} disabled={!canPrevPage}>Prev</button>
            <button onClick={nextPage} disabled={!canNextPage}>Next</button>
        </>
    );
}
```

### How `startIndex` / `endIndex` Work

```ts
startIndex = (currentPage - 1) * itemsPerPage;
endIndex   = Math.min(startIndex + itemsPerPage, totalItems);
```

Example: 123 items, 10 per page, on page 13:

```ts
currentPage = 13
startIndex  = 120
endIndex    = 123
itemsOnCurrentPage = 3   // partial last page
ITEMS.slice(120, 123)    // items 121, 122, 123 (1-based display)
```

### Bounds Safety

Every navigation function clamps internally:

| Call | Result |
|------|--------|
| `setPage(0)` | → page 1 |
| `setPage(999)` | → last page |
| `nextPage()` on last page | stays on last |
| `prevPage()` on first page | stays on first |

Even if `totalPages` **shrinks** (e.g., you increase `itemsPerPage`), `currentPage` is recalculated **during render**:

```ts
const currentPage = Math.max(1, Math.min(rawPage, totalPages));
```

No `useEffect`, no cascading renders, no ESLint warnings.

---

## 🔍 Hook #2 — `useDebounce`

### Purpose
Debounce a rapidly changing value so downstream effects (API calls, filtering) only run after the user stops typing.

### Signature

```ts
useDebounce<T>(value: T, delay?: number): T
```

### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T` | — | The value to debounce |
| `delay` | `number` | `500` | Delay in ms |

### Returns

| Name | Type | Description |
|------|------|-------------|
| `debouncedValue` | `T` | The value after `delay` ms of no change |

### Implementation

```ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
```

### Usage Example

```tsx
const [query, setQuery] = useState("");
const debouncedQuery = useDebounce(query, 500);

useEffect(() => {
    if (!debouncedQuery.trim()) return;
    console.log("Searching for:", debouncedQuery);
}, [debouncedQuery]);
```

---

## 🎨 Demo — Debounced API Search

`src/pages/DebounceSearch.tsx` demonstrates `useDebounce` with a **real API** (DummyJSON).

### Features

- **Live input** — the text box always reflects what you type
- **Debounced value** — updates only after the user stops typing
- **Adjustable delay** — change the debounce time on the fly
- **Real API calls** — `https://dummyjson.com/products/search?q=...`
- **Request cancellation** — `AbortController` prevents stale responses from overwriting newer ones
- **Loading spinner**, **error handling**, and **empty states**

### Why `AbortController` Matters

Debounce alone doesn't prevent **race conditions**. If the user types `cat`, then `ca` resolves after, the UI would briefly show stale `ca` results. Aborting the previous request ensures only the latest response wins.

```ts
const controller = new AbortController();

fetch(url, { signal: controller.signal });

return () => controller.abort();
```

### Console Logging

Every time the debounced value settles, the demo logs:

```
Searching for: phone
Searching for: laptop
Searching for: watch
```

### Try These Queries

| Query | Expected Results |
|-------|------------------|
| `phone` | iPhone, Samsung, etc. |
| `laptop` | MacBook, Dell, etc. |
| `watch` | Apple Watch, etc. |
| `xyzabc` | No results found |

---

## 🛡️ ESLint Rule Compliance

All hooks avoid the common React anti-pattern flagged by `react-hooks/set-state-in-effect`:

- **No `setState` at the top of an effect body.**
- Safe page in `usePagination` is **derived during render**.
- The debounced value is set **inside a `setTimeout` callback** — not synchronously in the effect.
- In the demo, empty-state UI is handled by **deriving** the visible list, not by resetting state in an effect.

---

## 🧪 Verified Edge Cases

### Pagination
| Scenario | Expected | Actual |
|----------|----------|--------|
| Page 1, click Prev | Stays on page 1 | ✅ |
| Last page, click Next | Stays on last | ✅ |
| `setPage(0)` | Clamps to 1 | ✅ |
| `setPage(999)` | Clamps to last | ✅ |
| 123 items, 10/page, page 13 | `itemsOnCurrentPage = 3` | ✅ |
| Change `itemsPerPage` mid-session | Auto-clamps to valid page | ✅ |

### Debounce
| Scenario | Expected | Actual |
|----------|----------|--------|
| Type quickly | Only one API call fires after settle | ✅ |
| Change delay | Next debounce uses new delay | ✅ |
| Clear input | No API call, results cleared | ✅ |
| Type & abort fast | Previous request cancelled | ✅ |
| Slow network | Loading spinner shows | ✅ |

---

## 🧰 Tech Stack

- **React 18+**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router**
- **Lucide Icons**
- **ESLint** with `react-hooks` rules

---

## 📁 Project Structure

```
.
├── src/
│   ├── hooks/
│   │   ├── usePagination.ts
│   │   └── useDebounce.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── PaginationDemo.tsx
│   │   └── DebounceSearch.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🗺️ Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Landing page with demo links |
| `/pagination` | `PaginationDemo` | Pagination hook demo |
| `/debounce-search` | `DebounceSearch` | Debounced API search demo |

---

## ✅ Requirements Fulfilled

### `usePagination`
- [x] Accepts `totalItems`, `itemsPerPage` (default 10), `initialPage` (default 1)
- [x] Returns `currentPage`, `totalPages`, `startIndex`, `endIndex`, `itemsOnCurrentPage`
- [x] Returns `setPage`, `nextPage`, `prevPage`
- [x] Returns `canNextPage`, `canPrevPage`
- [x] Uses `Math.ceil` for `totalPages`
- [x] Clamps `currentPage` to `[1, totalPages]`
- [x] `itemsOnCurrentPage` correct on partial last page
- [x] Demo component simulates 100+ items
- [x] Demo disables Prev/Next based on flags

### `useDebounce`
- [x] Accepts `value`, `delay` (default 500)
- [x] Returns `debouncedValue`
- [x] Uses `useState` for the debounced value
- [x] Uses `useEffect` + `setTimeout` + `clearTimeout`
- [x] Timer resets on `value` or `delay` change
- [x] Demo with input field
- [x] Demo shows current + debounced value
- [x] Demo simulates an API call on debounced change (`console.log("Searching for: ...")`)
- [x] Uses a real API (DummyJSON) with `AbortController`

### Cross-cutting
- [x] **No `react-hooks/set-state-in-effect` warnings**
- [x] Full TypeScript types
- [x] Clean, reusable, documented
- [x] Landing page for easy navigation

---
