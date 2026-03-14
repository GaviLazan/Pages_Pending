# Pages Pending - A Personal Library Tracker

Personal library management app built with React, allowing you to track your book collection, reading status, lending history, and ratings.

## Tech Stack

- **React** (via Vite)
- **localStorage** for data persistence
- **axios** for API calls
- **MUI (Material UI)** — `@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`
- **dayjs** — date handling for the date picker

## Features

### Core Features

- Add books via ISBN, title, or author (Open Library API) with loading indicator
- Add books manually (title + author + cover URL) via MUI Dialog modal
- Search for books by title or author (Open Library search API) with multi-select results modal and pagination
- Delete books with MUI Dialog confirmation
- Undo single-book delete: 5-second window via snackbar action button
- Track reading status: Untagged, To Be Read, Currently Reading, Read, Did Not Finish
- Lend books to friends with tracking (borrower name, lent date with date picker, overdue alerts)
- Return books
- Rate books 1-5 stars (MUI Rating)
- Real-time search by title or author
- Filter by status and toggle lent book visibility
- Sort by title, author name, rating, or date added (ascending/descending)
- Grid and list view modes (list view: compact rows with thumbnail, status, rating, and inline actions)
- Bulk selection mode: select multiple books to lend, return, change status, or delete in one action
- Library statistics dashboard
- Lent out stats panel with human-readable duration (e.g. "1 year, 3 months, 2 weeks")
- Edit book information (title, author, cover URL, lent info) via MUI Dialog
- Empty state messages for filtered/search results
- Snackbar notifications for add, edit, and delete; delete includes a 5-second undo action
- Skeleton loading states for initial grid and individual cover images
- Overdue indicator: growing red top border (scales from 2px at 4 weeks to 10px at 6 months)
- Tooltips on truncated titles, author names, and lent info
- Dark mode toggle

### Data Model

Each book contains:

- `id`, `title`, `author`, `coverUrl`, `isbn`
- `status`: `null | 'tbr' | 'reading' | 'read' | 'dnf'`
- `rating`: 0-5
- `isLent`: boolean (separate from status — books keep their reading status when lent)
- `lentTo`, `lentDate` (lending metadata)
- `dateAdded`

## Project Structure

```
src/
├── api/
│   └── openLibrary.js          # Open Library API: ISBN lookup + title/author search
├── components/
│   ├── AddBookForm.jsx          # ISBN/title/author search form with results modal
│   ├── BookFormModal.jsx        # Combined add/edit modal form
│   ├── BookCard.jsx             # Individual book card (grid view)
│   ├── BookGrid.jsx             # Grid layout for book cards
│   ├── BookList.jsx             # Compact list view (rows with thumbnail + inline actions)
│   ├── BulkActionBar.jsx        # Floating action bar for bulk operations on selected books
│   ├── ClearLibraryButton.jsx   # Resets localStorage to seed data
│   ├── FilterBar.jsx            # Status filter buttons + hide lent toggle
│   ├── SortBar.jsx              # Sort type dropdown + asc/desc toggle + grid/list view toggle
│   ├── LentStatusPanel.jsx      # Panel listing all lent books with duration
│   └── LibraryStatsBar.jsx      # Stats bar (total, read, reading, lent)
├── data/
│   └── seedData.json            # Seed data (migrated from v1 library.json)
├── utils/
│   ├── storage.js               # localStorage utilities (getBooks, saveBooks, hasSeed)
│   ├── seedLibrary.js           # Seed function (first-load migration)
│   ├── statusColors.js          # Status color maps for light and dark modes
│   ├── lendLengthCalc.js        # Lent duration as 0-100% (used for overdue bar intensity)
│   └── lendLengthAsString.js    # Lent duration as human-readable string (e.g. "3 months, 2 weeks")
├── App.jsx                      # Main app component — all state and handlers
├── Root.jsx                     # Theme provider (CssVarsProvider, dark mode, LocalizationProvider)
├── main.jsx                     # React entry point
└── index.css                    # Global styles
```

## Setup & Installation

```bash
# Clone the repo
git clone https://github.com/GaviLazan/pages-pending.git
cd my-react-library

# Install dependencies
npm install

# Run dev server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Color Palette

| Role                   | Light mode  | Dark mode   |
| ---------------------- | ----------- | ----------- |
| Primary                | `#507993`   | `#6BAFC9`   |
| Secondary              | `#D4B99E`   | `#C4A882`   |
| Success (save/confirm) | `#7AAC6C`   | `#7ebd70`   |
| Info (return book)     | `#F2CA50`   | `#FFD966`   |
| Warning                | `#F29325`   | `#FFB347`   |
| Error                  | `#c62828`   | `#FF6B6B`   |
| Background             | `#fffbf5`   | `#1c1c28`   |

## Development Timeline

### Sprint 0: Foundation

- Vite + React project setup
- localStorage utilities (getBooks, saveBooks, hasSeed)
- Seed function (migrates existing library.json data with new fields: status, rating, isLent)
- BookCard and BookGrid components
- CSS grid layout
- Image error handling (shows placeholder on broken images)
- RTL text support for Hebrew/Arabic titles and authors

### Sprint 1: Add, Delete, Status, Lending

- Open Library API integration with author fallback logic
- AddBookForm component (ISBN input + Enter key support)
- Delete with confirmation
- Status selector (null/TBR/reading/read/DNF)
- Card visual indicators by status
- Lending system (lend/return with borrower name and date tracking)
- Gradual overdue indicator (starts at 4 weeks, maxes at 6 months)
- Lent cards show borrower name and date instead of author
- Dates stored as ISO format (yyyy-mm-dd), displayed as dd/mm/yyyy
- Auto-save to localStorage on all changes
- Long title truncation (2-line limit with ellipsis)

### Sprint 2: Filters, Search, Stats, Edit

- Star rating (1-5 stars, all books)
- Status filter bar (All / Untagged / TBR / Reading / Read / DNF)
- Hide lent books toggle
- Sort controls: title, author, rating, date added — ascending and descending; resets to ascending on sort type change
- Real-time search (title and author, case-insensitive, partial match)
- Empty state messages ("No books matching X" / "No books in X")
- Lent out stats panel with human-readable duration (today / days / weeks / months / years)
- Library stats bar (total, read, reading, on loan)
- BookFormModal: combined add and edit form
- Edit button on each card
- Open Library + favicon attribution in footer
- Inline validation for all forms
- Image URL validated via new Image() load test
- useRef auto-focus on lender name input when lend form opens

### Sprint 3: MUI Polish & QA

- App renamed to **Pages Pending**

#### UI Polish Pass

- MUI Theme with Ocean Breeze palette (`ThemeProvider` + `CssBaseline` in `main.jsx`)
- `LocalizationProvider` with `AdapterDayjs` (en-gb locale) for date picker
- useRef autofocus: ISBN input on page load, title field when BookFormModal opens
- All buttons replaced with MUI `Button` / `IconButton`
- All text inputs replaced with MUI `TextField` (with `error` + `helperText` for field-level errors, `Alert` for form-level errors)
- Status dropdown replaced with `Button` + `Menu` pattern (colored label reflects current status)
- Sort bar redesigned as MUI Button group with arrow icon toggle
- Filter bar uses MUI Buttons with status-matched `sx` colors and `Switch` for lent toggle
- Delete confirmation replaced with MUI `Dialog`
- BookFormModal and lend form converted to MUI `Dialog` overlays with `Slide` transition
- `form` + `id` attribute pattern connects submit buttons in `DialogActions` to forms in `DialogContent`
- Star rating replaced with MUI `Rating` component
- Date picker added to lend form and edit modal (`DatePicker` from `@mui/x-date-pickers`)
- BookCard wrapped in MUI `Card` with `CardMedia` and `CardContent`
- MUI `Tooltip` on truncated titles, author names, and lent info
- Overdue indicator: growing red top border (replaces red glow box-shadow)
- Bottom icon buttons on cards: Edit (EditNote), Lend/Return (FileUpload/FileDownload), Delete
- Snackbar notifications for add, edit, and delete (app-level state in App.jsx)
- Skeleton loading: card grid on initial load, individual cover images while loading
- Footer overlap fixed

- Responsive layout review
- Cross-browser testing (Chrome + Firefox minimum)
- Remove all console.log statements
- Verify localStorage seed works on fresh browser
- Build Presentation and write demo script / talking points

### Sprint 4: Bug Fixes & UX Improvements

#### Bug Fixes

- Fixed `DialogTitle` incorrectly nested inside `DialogContent` in BookFormModal (MUI structural issue)
- Fixed image validation error `Alert` only rendering for lent books — now visible in all form modes (add and edit)
- Fixed Skeleton loading state getting stuck indefinitely on book cards without a cover image
- Added `onClose` handler to delete dialog and lend dialog — Escape key and click-outside now dismiss both
- Fixed invalid CSS `marginTop: "0 px"` (space between value and unit caused property to be ignored)
- Renamed `BookFormModal .jsx` → `BookFormModal.jsx` (trailing space in filename caused cross-platform issues)

#### UX Improvements

- Image URL validation now shows a grey disabled button with `CircularProgress` spinner while checking, preventing double-submission
- `console.error` in API error handler now only logs in development mode (`import.meta.env.DEV`)
- Progressive cover image loading: skeleton shows for up to 8 seconds while image loads, then falls back to title placeholder — image swaps in if/when it eventually loads

## Data Persistence

- **First load:** Seeds localStorage from `seedData.json` (existing library data from v1)
- **Subsequent loads:** Reads from localStorage
- **Auto-save:** All changes (add/delete/edit/lend/return/rate) automatically persist to localStorage
- **Seeded flag:** Prevents re-seeding on reload, even if library is empty

## API Integration

### Open Library API

- **ISBN lookup:** Fetches title, author, and cover from `/isbn/{isbn}.json` with author fallback via work/edition chain
- **Title search:** `fetchBooks("title", query)` → `/search.json?title=...`
- **Author search:** `fetchBooks("author", query)` → `/search.json?author=...`
- Both search modes return paginated results (10 per page) with "Load more" support
- **Cover images:** `http://covers.openlibrary.org/b/id/{coverId}-M.jpg` (note: http, not https)
- **Attribution:** Open Library attribution displayed in footer

### BookCover API — Deferred to Post-Presentation

The BookCover API (https://bookcover.longitood.com) was successfully implemented but is currently disabled due to CORS policy blocking browser requests. Requires a backend proxy.

**Code to restore** (place in `openLibrary.js` cover section):

```javascript
try {
  const bookCoverResponse = await axios.get(
    `https://bookcover.longitood.com/bookcover/${isbn}`,
  );
  coverUrl = bookCoverResponse.data.url;
} catch {
  if (bookData.covers && bookData.covers.length > 0) {
    const coverId = bookData.covers[0];
    coverUrl = `http://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  }
}
```

## Known Issues

- Some books may return "Unknown Author" from Open Library API (upstream issue)
- Cover quality varies by source availability
- BookCover API currently disabled (requires backend proxy for CORS)
- Image covers reload on filter change (Open Library CDN caching behavior, not a code issue)

## Academic Context

This project was built as part of the SheCodes bootcamp React module. The original assignment was a To-Do List app, adapted to rebuild an existing vanilla JavaScript library tracker in React.

**Learning objectives:**

- React fundamentals (components, state, props, hooks)
- Data persistence with localStorage
- API integration and error handling
- Component-driven architecture
- MUI component library integration
- Project planning and sprint-based development

### Sprint 5: Post-Presentation Enhancements

- **Dark mode:** Full light/dark theme via MUI `CssVarsProvider` + `extendTheme`; toggle in top bar; `Root.jsx` now wraps `App` with theme and locale providers; `statusColors.js` centralises status colour maps for both modes
- **List view:** New `BookList.jsx` component; compact row layout with thumbnail, inline status/rating/actions; toggle between grid and list view in `SortBar`
- **Bulk selection mode:** Click any book cover/thumbnail to enter selection mode; `BulkActionBar` floats above footer with lend, return, status, and delete actions for all selected books
- **Book search by title/author:** `AddBookForm` now has ISBN / Title / Author toggle; title and author modes query Open Library `/search.json`; results shown in a multi-select modal with cover, author, year, and "Load more" pagination
- **Undo delete:** Single-book delete shows a 5-second snackbar with an UNDO button; book is re-inserted at its original position if undone
- **Lent duration fix:** `lendLengthAsString` rewritten with remainder-based arithmetic; no longer outputs "2 years, 0 months"; shows weeks for sub-year durations (e.g. "3 months, 2 weeks")

## Post-Presentation Enhancements

1. **Add backend (Node/Express)** to enable BookCover API via proxy
2. **Export/import library data**
3. **Drag and drop manual sorting**
4. **Image caching** (requires backend)

---

**Built by:** Gavi Lazan  
**Course:** SheCodes Fullstack Bootcamp
**Last Updated:** March 15, 2026
