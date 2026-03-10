import { useState, useEffect } from "react";
import { getBooks, saveBooks } from "./utils/storage";
import seedLibrary from "./utils/seedLibrary";
import BookGrid from "./components/BookGrid";
import AddBookForm from "./components/AddBookForm";
import BookFormModal from "./components/BookFormModal";
import FilterBar from "./components/FilterBar";
import SortBar from "./components/SortBar";
import LentStatusPanel from "./components/LentStatusPanel";
import LibraryStatsBar from "./components/LibraryStatsBar";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";
import { Divider } from "@mui/material";

export default function App() {
  const [books, setBooks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lentFilter, setLentFilter] = useState(false);
  const [activeSort, setActiveSort] = useState("title");
  const [sortAscending, setSortAscending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookFormState, setBookFormState] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    seedLibrary();
    const bookList = getBooks();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(bookList);
    setIsLoading(false);
  }, []);

  function handleAddBook(bookData) {
    const newBook = {
      ...bookData,
      id: Date.now(),
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

  function handleDelete(bookId) {
    const deletedBook = books.find((book) => book.id === bookId);
    const updatedBooks = books.filter((book) => book.id !== bookId);
    showSnackbar(`${deletedBook.title} has been deleted`);
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
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

  const hideLentBooks =
    lentFilter === false
      ? filteredBooks
      : filteredBooks.filter((book) => book.isLent !== lentFilter);

  function handleSortChange(newSort) {
    setActiveSort(newSort);
    setSortAscending(false);
  }

  const searchedBooks =
    searchTerm === ""
      ? hideLentBooks
      : hideLentBooks.filter(
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
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  return (
    <div>
      <div className="top-bar">
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
            setBookFormState={setBookFormState}
            showSnackbar={showSnackbar}
          />
          {bookFormState && (
            <BookFormModal
              onAddBook={handleAddBook}
              onEditBook={handleEditBook}
              bookFormState={bookFormState}
              setBookFormState={setBookFormState}
            />
          )}{" "}
        </div>
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
            label="Search"
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
          />
          <SortBar
            activeSort={activeSort}
            handleSortChange={handleSortChange}
            sortAscending={sortAscending}
            setSortAscending={setSortAscending}
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
      </div>
      <div className="content-area">
        <div className="side-panel">
          <LentStatusPanel books={books} />
          <hr />
          <LibraryStatsBar books={books} />
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
        {sortedBooks.length > 0 && (
          <BookGrid
            books={sortedBooks}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onLendBook={handleLendBook}
            onReturnBook={handleReturnBook}
            onRatingChange={handleRatingChange}
            setBookFormState={setBookFormState}
          />
        )}
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
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
