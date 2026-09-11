# Custom Hooks Lab — `usePagination`

A small React + TypeScript lab demonstrating how to build a **reusable pagination hook** and consume it in a demo component.

---

## 📦 What's Inside

```
src/
├── hooks/
│   └── usePagination.ts      # The custom hook
├── PaginationDemo.tsx        # Demo component using the hook
└── App.tsx                   # Renders <PaginationDemo />
```

---

## ✨ Features

- 🔢 Full pagination API: page state, index ranges, navigation controls, boundary flags
- 🛡️ Bounds-safe: `currentPage` is always clamped between `1` and `totalPages`
- ⚡ No `useEffect` for state syncing — safe page is **derived during render** (no cascading renders, no ESLint warnings)
- 🎯 Handles partial last pages correctly (`itemsOnCurrentPage`)
- 🎨 Beautiful demo UI with:
  - Active page button **automatically centered** in a scrollable strip
  - Smooth scrolling on every navigation
  - Disabled states for boundary buttons
  - Jump-to-page input
  - Keyboard-accessible controls

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open the printed URL (usually `http://localhost:5173`) in your browser.

---

## 🧠 The Hook

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
| `itemsPerPage` | `number` | `10` | Number of items per page |
| `initialPage` | `number` | `1` | Page to start on |

### Returns

| Name | Type | Description |
|------|------|-------------|
| `currentPage` | `number` | Current active page (1-based, always clamped) |
| `totalPages` | `number` | Total pages, computed with `Math.ceil(totalItems / itemsPerPage)` |
| `startIndex` | `number` | **0-based** start index for slicing |
| `endIndex` | `number` | **0-based** exclusive end index for slicing |
| `itemsOnCurrentPage` | `number` | Actual count on the current page (handles partial last page) |
| `setPage` | `(page: number) => void` | Jump to a specific page (clamped) |
| `nextPage` | `() => void` | Go to the next page (no-op on last page) |
| `prevPage` | `() => void` | Go to the previous page (no-op on first page) |
| `canNextPage` | `boolean` | `true` if a next page exists |
| `canPrevPage` | `boolean` | `true` if a previous page exists |

---

## 📖 Usage Example

```tsx
import { usePagination } from "./hooks/usePagination";

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
    } = usePagination({
        totalItems: ITEMS.length,
        itemsPerPage: 10,
        initialPage: 1,
    });

    const visibleItems = ITEMS.slice(startIndex, endIndex);

    return (
        <div>
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

            <button onClick={prevPage} disabled={!canPrevPage}>
                Previous
            </button>
            <button onClick={() => setPage(1)}>First</button>
            <button onClick={nextPage} disabled={!canNextPage}>
                Next
            </button>
            <button onClick={() => setPage(totalPages)}>Last</button>
        </div>
    );
}
```

---

## 🧮 How `startIndex` / `endIndex` Work

The hook returns **0-based** indices suitable for `Array.prototype.slice`:

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
ITEMS.slice(120, 123)    // returns items 121, 122, 123 (1-based display)
```

---

## 🛡️ Bounds Safety

Every navigation function clamps internally:

| Input | `setPage(0)` | `setPage(999)` | `nextPage()` on last | `prevPage()` on first |
|-------|--------------|----------------|----------------------|-----------------------|
| Result | → page 1 | → last page | stays on last | stays on first |

Even if `totalPages` **shrinks** (e.g., you increase `itemsPerPage`), `currentPage` is recalculated **during render**:

```ts
const currentPage = Math.max(1, Math.min(rawPage, totalPages));
```

No `useEffect`, no cascading renders, no ESLint warnings.

---

## 🎨 The Demo Component

`src/PaginationDemo.tsx` showcases the hook with:

- **123 sample items** to simulate a realistic dataset
- **Scrollable page-number strip** that keeps the active page **centered**
- **Smooth auto-scroll** using `useLayoutEffect` + `scrollTo({ behavior: "smooth" })`
- **First / Prev / Next / Last** buttons with proper disabled states
- **Jump-to-page** input

### Active Page Centering Logic

```tsx
useLayoutEffect(() => {
    const active = pageButtonRefs.current[currentPage];
    const container = numbersRef.current;
    if (!active || !container) return;

    const target =
        active.offsetLeft -
        container.clientWidth / 2 +
        active.clientWidth / 2;

    const maxScroll = container.scrollWidth - container.clientWidth;
    container.scrollTo({
        left: Math.max(0, Math.min(target, maxScroll)),
        behavior: "smooth",
    });
}, [currentPage]);
```

This ensures the currently selected page is always visible and centered — no matter how many pages exist.

---

## 🧪 Verified Edge Cases

| Scenario | Expected | Actual |
|----------|----------|--------|
| Page 1, click Prev | Stays on page 1, `canPrevPage=false` | ✅ |
| Last page, click Next | Stays on last, `canNextPage=false` | ✅ |
| `setPage(0)` | Clamps to page 1 | ✅ |
| `setPage(999)` | Clamps to last page | ✅ |
| 123 items, 10/page, page 13 | `itemsOnCurrentPage=3` | ✅ |
| Change `itemsPerPage` to 20 while on page 13 | Auto-clamps to page 7 | ✅ |
| Click active page number | No-op (button disabled) | ✅ |

---

## 🧰 Tech Stack

- **React 18+**
- **TypeScript**
- **Vite** (dev server + build)
- **Tailwind CSS** (styling)
- **ESLint** with `react-hooks` rules

---

## 📁 Project Structure

```
.
├── src/
│   ├── hooks/
│   │   └── usePagination.ts
│   ├── PaginationDemo.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ✅ Requirements Fulfilled

- [x] Accepts `totalItems`, `itemsPerPage` (default 10), `initialPage` (default 1)
- [x] Returns `currentPage`, `totalPages`, `startIndex`, `endIndex`, `itemsOnCurrentPage`
- [x] Returns `setPage`, `nextPage`, `prevPage`
- [x] Returns `canNextPage`, `canPrevPage`
- [x] Uses `Math.ceil` for `totalPages`
- [x] Clamps `currentPage` to `[1, totalPages]`
- [x] `itemsOnCurrentPage` correct on partial last page
- [x] Demo component simulates 100+ items
- [x] Demo disables Previous/Next based on flags
- [x] No ESLint warnings

---

