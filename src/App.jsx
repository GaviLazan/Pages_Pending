import { useState, useEffect } from "react";
import { getBooks, saveBooks } from "./utils/storage";
import seedLibrary from "./utils/seedLibrary";
import BookGrid from "./components/BookGrid";
import AddBookForm from "./components/AddBookForm";
import BookFormModal from "./components/BookFormModal ";
import FilterBar from "./components/FilterBar";
import SortBar from "./components/SortBar";
import LentStatusPanel from "./components/LentStatusPanel";
import LibraryStatsBar from "./components/LibraryStatsBar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function App() {
  const [books, setBooks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lentFilter, setLentFilter] = useState(false);
  const [activeSort, setActiveSort] = useState("title");
  const [sortAscending, setSortAscending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookFormState, setBookFormState] = useState(null);

  useEffect(() => {
    seedLibrary();
    const bookList = getBooks();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(bookList);
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
  }

  function handleDelete(bookId) {
    const updatedBooks = books.filter((book) => book.id !== bookId);
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
  }

  function handleEditBook(bookId, updatedData) {
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, ...updatedData } : book,
    );
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
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

  return (
    <div>
      <h1>My Library</h1>
      <AddBookForm
        onAddBook={handleAddBook}
        onEditBook={handleEditBook}
        bookFormState={bookFormState}
        setBookFormState={setBookFormState}
      />
      <Button variant="contained" onClick={() => setBookFormState("add")}>
        Add Book Manually
      </Button>
      {bookFormState && (
        <BookFormModal
          onAddBook={handleAddBook}
          onEditBook={handleEditBook}
          bookFormState={bookFormState}
          setBookFormState={setBookFormState}
        />
      )}
      <FilterBar
        activeFilter={activeFilter}
        handleFilterChange={handleFilterChange}
        lentFilter={lentFilter}
        setLentFilter={setLentFilter}
      />
      <br />
      <SortBar
        activeSort={activeSort}
        handleSortChange={handleSortChange}
        sortAscending={sortAscending}
        setSortAscending={setSortAscending}
      />
      <br />
      <TextField
        label="Search"
        type="text"
        variant="filled"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSortAscending(false);
        }}
      />
      {searchTerm !== "" && sortedBooks.length === 0 && (
        <p>No books matching {searchTerm}</p>
      )}
      {activeFilter !== "all" && sortedBooks.length === 0 && (
        <p>No books in {activeFilter}</p>
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
      <LentStatusPanel books={books} />
      <LibraryStatsBar books={books} />
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
