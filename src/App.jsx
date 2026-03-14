import { useState, useEffect, useCallback, useRef } from "react";
import { getBooks, saveBooks } from "./utils/storage";
import seedLibrary from "./utils/seedLibrary";

import BookGrid from "./components/BookGrid";
import BookList from "./components/BookList";
import AddBookForm from "./components/AddBookForm";
import BookFormModal from "./components/BookFormModal";
import FilterBar from "./components/FilterBar";
import SortBar from "./components/SortBar";
import LentStatusPanel from "./components/LentStatusPanel";
import LibraryStatsBar from "./components/LibraryStatsBar";
import ClearLibraryButton from "./components/ClearLibraryButton";
import BulkActionBar from "./components/BulkActionBar";

import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, Button } from "@mui/material";
import { Divider } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Box } from "@mui/material";

export default function App({ darkMode, setDarkMode }) {
  const [books, setBooks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lentFilter, setLentFilter] = useState(null);
  const [activeSort, setActiveSort] = useState("title");
  const [sortAscending, setSortAscending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookFormState, setBookFormState] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const [selectedBooks, setSelectedBooks] = useState(new Set());
  const isSelectionMode = selectedBooks.size > 0;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    duration: 3000,
    onUndo: null,
  });
  const [pendingUndo, setPendingUndo] = useState(null);
  const undoTimerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    seedLibrary();
    const bookList = getBooks();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(bookList);
    setIsLoading(false);
  }, []);

  function toTitleCase(str) {
    if (!str) return str;
    const LOWERCASE_WORDS = new Set([
      "a","an","the","and","but","or","nor","for","so","yet",
      "at","by","in","of","on","to","up","as","via","per",
    ]);
    return str
      .split(" ")
      .map((word, i) =>
        i === 0 || !LOWERCASE_WORDS.has(word.toLowerCase())
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : word.toLowerCase()
      )
      .join(" ");
  }

  function handleAddBook(bookData) {
    const newBook = {
      ...bookData,
      title: toTitleCase(bookData.title),
      author: toTitleCase(bookData.author),
      id: crypto.randomUUID(),
      status: null,
      isLent: false,
      rating: 0,
      lentTo: "",
      lentDate: "",
      dateAdded: new Date().toISOString(),
    };

    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
    showSnackbar(`${newBook.title} added successfully`);
    setBookFormState(null);
  }

  function handleAddBooks(booksData) {
    const newBooks = booksData.map((bookData) => ({
      ...bookData,
      title: toTitleCase(bookData.title),
      author: toTitleCase(bookData.author),
      id: crypto.randomUUID(),
      status: null,
      isLent: false,
      rating: 0,
      lentTo: "",
      lentDate: "",
      dateAdded: new Date().toISOString(),
    }));
    setBooks((prev) => {
      const updated = [...prev, ...newBooks];
      saveBooks(updated);
      return updated;
    });
  }

  const handleToggleSelect = useCallback((bookId) => {
    setSelectedBooks((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  }, []);

  function handleDeselectAll() {
    setSelectedBooks(new Set());
  }

  function handleBulkDelete() {
    const ids = selectedBooks;
    const count = ids.size;
    const updatedBooks = books.filter((b) => !ids.has(b.id));
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
    setSelectedBooks(new Set());
    showSnackbar(`${count} book${count !== 1 ? "s" : ""} deleted`);
  }

  function handleBulkStatusChange(newStatus) {
    const ids = selectedBooks;
    const count = ids.size;
    const updatedBooks = books.map((b) =>
      ids.has(b.id) ? { ...b, status: newStatus } : b,
    );
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
    setSelectedBooks(new Set());
    showSnackbar(`Status updated for ${count} book${count !== 1 ? "s" : ""}`);
  }

  function handleBulkLend(lentTo, lentDate) {
    const ids = selectedBooks;
    const lentCount = books.filter((b) => ids.has(b.id) && !b.isLent).length;
    const updatedBooks = books.map((b) =>
      ids.has(b.id) && !b.isLent ? { ...b, isLent: true, lentTo, lentDate } : b,
    );
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
    setSelectedBooks(new Set());
    showSnackbar(
      `${lentCount} book${lentCount !== 1 ? "s" : ""} lent to ${lentTo}`,
    );
  }

  function handleBulkReturn() {
    const ids = selectedBooks;
    const returnCount = books.filter((b) => ids.has(b.id) && b.isLent).length;
    const updatedBooks = books.map((b) =>
      ids.has(b.id) && b.isLent
        ? { ...b, isLent: false, lentTo: "", lentDate: "" }
        : b,
    );
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
    setSelectedBooks(new Set());
    showSnackbar(`${returnCount} book${returnCount !== 1 ? "s" : ""} returned`);
  }

  function handleUndoDelete(book, index) {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setBooks((prev) => {
      const next = [...prev];
      next.splice(index, 0, book);
      saveBooks(next);
      return next;
    });
    setPendingUndo(null);
    handleSnackbarClose();
  }

  function handleDelete(bookId) {
    const index = books.findIndex((book) => book.id === bookId);
    const deletedBook = books[index];
    const updatedBooks = books.filter((book) => book.id !== bookId);
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
    setSelectedBooks((prev) => {
      const next = new Set(prev);
      next.delete(bookId);
      return next;
    });
    setPendingUndo({ book: deletedBook, index });
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setPendingUndo(null), 5000);
    showSnackbar(`"${deletedBook.title}" deleted`, "success", {
      duration: 5000,
      onUndo: () => handleUndoDelete(deletedBook, index),
    });
  }

  function handleEditBook(bookId, updatedData) {
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, ...updatedData } : book,
    );
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
    showSnackbar(`${updatedData.title} edited successfully`);
    setBookFormState(null);
  }

  function handleStatusChange(bookId, newStatus) {
    newStatus = newStatus === "null" ? null : newStatus;
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, status: newStatus } : book,
    );
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
  }

  function handleLendBook(bookId, lentTo, lentDate) {
    const lendBook = books.map((book) =>
      book.id === bookId
        ? { ...book, isLent: true, lentTo: lentTo, lentDate: lentDate }
        : book,
    );
    setBooks(lendBook);
    saveBooks(lendBook);
  }

  function handleReturnBook(bookId) {
    const returnBook = books.map((book) =>
      book.id === bookId
        ? { ...book, isLent: false, lentTo: "", lentDate: "" }
        : book,
    );
    setBooks(returnBook);
    saveBooks(returnBook);
  }

  function handleRatingChange(bookId, rating) {
    const updatedRating = books.map((book) =>
      book.id === bookId ? { ...book, rating: rating } : book,
    );
    setBooks(updatedRating);
    saveBooks(updatedRating);
  }

  function handleFilterChange(filter) {
    setActiveFilter(filter);
  }

  const filteredBooks =
    activeFilter === "all"
      ? books
      : activeFilter === "untagged"
        ? books.filter((book) => book.status === null)
        : books.filter((book) => book.status === activeFilter);

  const filterLentBooks =
    lentFilter === null
      ? filteredBooks
      : lentFilter === "show"
        ? filteredBooks.filter((book) => book.isLent)
        : filteredBooks.filter((book) => !book.isLent);

  function handleSortChange(newSort) {
    setActiveSort(newSort);
    setSortAscending(false);
  }

  const searchedBooks =
    searchTerm === ""
      ? filterLentBooks
      : filterLentBooks.filter(
          (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()),
        );

  const sortedBooks = [...searchedBooks].sort((a, b) => {
    if (activeSort === "title") {
      if (!sortAscending) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    } else if (activeSort === "author") {
      if (!sortAscending) {
        return a.author.localeCompare(b.author);
      } else {
        return b.author.localeCompare(a.author);
      }
    } else if (activeSort === "rating") {
      if (!sortAscending) {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    } else if (activeSort === "date") {
      if (!sortAscending) {
        return String(a.dateAdded || "").localeCompare(
          String(b.dateAdded || ""),
        );
      } else {
        return String(b.dateAdded || "").localeCompare(
          String(a.dateAdded || ""),
        );
      }
    }
  });

  // snackbar functions
  const showSnackbar = (message, severity = "success", options = {}) => {
    setSnackbar({
      open: true,
      message,
      severity,
      duration: options.duration ?? 3000,
      onUndo: options.onUndo ?? null,
    });
  };
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false, onUndo: null }));
  };
  return (
    <div>
      <Box className="top-bar" sx={{ bgcolor: "background.paper" }}>
        <Typography
          className="title"
          variant="h3"
          gutterBottom
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            fontSize: "36px",
          }}
        >
          <img
            src="/noun-library-2403.svg"
            alt=""
            style={{ width: "32px", height: "32px" }}
          />
          Pages Pending
        </Typography>
        <div className="add-zone">
          <AddBookForm
            onAddBook={handleAddBook}
            onAddBooks={handleAddBooks}
            setBookFormState={setBookFormState}
            showSnackbar={showSnackbar}
          />
          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </div>
        {bookFormState && (
          <BookFormModal
            onAddBook={handleAddBook}
            onEditBook={handleEditBook}
            bookFormState={bookFormState}
            setBookFormState={setBookFormState}
          />
        )}
        <Divider
          orientation="horizontal"
          flexItem
          sx={{ width: "50%", alignSelf: "center" }}
        />
        <div className="controls-zone">
          <TextField
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: "#888", mr: 1 }} />,
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
              },
            }}
            sx={{ width: "220px" }}
            size="small"
            label="Search Library"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSortAscending(false);
            }}
          />
          <FilterBar
            activeFilter={activeFilter}
            handleFilterChange={handleFilterChange}
            lentFilter={lentFilter}
            setLentFilter={setLentFilter}
            darkMode={darkMode}
          />
          <SortBar
            activeSort={activeSort}
            handleSortChange={handleSortChange}
            sortAscending={sortAscending}
            setSortAscending={setSortAscending}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          {searchTerm !== "" && sortedBooks.length === 0 && (
            <p>No books matching {searchTerm}</p>
          )}
          {activeFilter !== "all" && sortedBooks.length === 0 && (
            <p>No books in {activeFilter}</p>
          )}
        </div>
      </Box>
      <div className="content-area">
        <div className="side-panel">
          <LentStatusPanel books={books} />
          <hr />
          <LibraryStatsBar books={books} />
          <hr />
          <ClearLibraryButton
            style={{ marginLeft: "auto", marginBotton: "auto" }}
            onClear={() => {
              setBooks([]);
              saveBooks([]);
            }}
          />
        </div>
        {isLoading && (
          <div className="book-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={200}
                height={320}
              />
            ))}
          </div>
        )}
        {sortedBooks.length > 0 && viewMode === "grid" && (
          <BookGrid
            books={sortedBooks}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onLendBook={handleLendBook}
            onReturnBook={handleReturnBook}
            onRatingChange={handleRatingChange}
            setBookFormState={setBookFormState}
            darkMode={darkMode}
            selectedBooks={selectedBooks}
            onToggleSelect={handleToggleSelect}
            isSelectionMode={isSelectionMode}
          />
        )}
        {sortedBooks.length > 0 && viewMode === "list" && (
          <BookList
            books={sortedBooks}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onLendBook={handleLendBook}
            onReturnBook={handleReturnBook}
            onRatingChange={handleRatingChange}
            setBookFormState={setBookFormState}
            darkMode={darkMode}
            selectedBooks={selectedBooks}
            onToggleSelect={handleToggleSelect}
            isSelectionMode={isSelectionMode}
          />
        )}
      </div>
      <BulkActionBar
        selectedBooks={selectedBooks}
        books={books}
        onDeselectAll={handleDeselectAll}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkLend={handleBulkLend}
        onBulkReturn={handleBulkReturn}
        darkMode={darkMode}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={handleSnackbarClose}
      >
        <Alert
          severity={snackbar.severity}
          action={
            snackbar.onUndo ? (
              <Button color="inherit" size="small" onClick={snackbar.onUndo}>
                UNDO
              </Button>
            ) : undefined
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <footer>
        Book data provided by{" "}
        <a href="https://openlibrary.org" target="_blank">
          Open Library{" "}
        </a>{" "}
        <br /> favicon by{" "}
        <a href="https://thenounproject.com/creator/samanbb/" target="_blank">
          Saman Bemel-Benrud from Noun Project{" "}
        </a>{" "}
      </footer>
    </div>
  );
}
