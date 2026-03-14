import { useState, useRef, useEffect } from "react";
import { fetchBookByISBN, fetchBooks } from "../api/openLibrary";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const PAGE_SIZE = 10;

const SEARCH_LABELS = {
  isbn: "Add book by ISBN",
  title: "Add book by title",
  author: "Add book by author",
};

const EMPTY_WARNINGS = {
  isbn: "Please enter an ISBN",
  title: "Please enter a title",
  author: "Please enter an author name",
};

export default function AddBookForm({
  onAddBook,
  onAddBooks,
  setBookFormState,
  showSnackbar,
}) {
  const [searchMode, setSearchMode] = useState("isbn");
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null); // null = closed
  const [totalResults, setTotalResults] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!query.trim()) {
      showSnackbar(EMPTY_WARNINGS[searchMode], "warning");
      return;
    }

    setIsLoading(true);
    try {
      if (searchMode === "isbn") {
        const bookData = await fetchBookByISBN(query);
        onAddBook(bookData);
        setQuery("");
        showSnackbar(`${bookData.title} added successfully`, "success");
      } else {
        const { docs, numFound } = await fetchBooks(
          searchMode,
          query,
          0,
          PAGE_SIZE,
        );
        if (docs.length === 0) {
          showSnackbar("No results found", "warning");
        } else {
          setResults(docs);
          setTotalResults(numFound);
          setSelected(new Set());
        }
      }
    } catch (error) {
      showSnackbar(`Error: ${error.message}`, "warning");
    } finally {
      setIsLoading(false);
    }
  };

  async function handleLoadMore() {
    setIsLoadingMore(true);
    try {
      const { docs } = await fetchBooks(
        searchMode,
        query,
        results.length,
        PAGE_SIZE,
      );
      setResults((prev) => [...prev, ...docs]);
    } catch (error) {
      showSnackbar(`Error: ${error.message}`, "warning");
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleToggleResult(i) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleAddSelected() {
    const toAdd = results.filter((_, i) => selected.has(i));
    if (toAdd.length === 1) {
      onAddBook(toAdd[0]);
      showSnackbar(`${toAdd[0].title} added successfully`, "success");
    } else {
      onAddBooks(toAdd);
      showSnackbar(`${toAdd.length} books added`, "success");
    }
    setResults(null);
    setQuery("");
    setSelected(new Set());
  }

  function handleCloseResults() {
    setResults(null);
    setSelected(new Set());
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasMore = results !== null && results.length < totalResults;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <ToggleButtonGroup
          value={searchMode}
          exclusive
          size="small"
          onChange={(_, val) => {
            if (val) {
              setSearchMode(val);
              setQuery("");
            }
          }}
        >
          <ToggleButton value="isbn">ISBN</ToggleButton>
          <ToggleButton value="title">Title</ToggleButton>
          <ToggleButton value="author">Author</ToggleButton>
        </ToggleButtonGroup>

        <form className="add-book-form" onSubmit={handleSubmit}>
          <TextField
            sx={{ width: "250px" }}
            size="small"
            label={SEARCH_LABELS[searchMode]}
            value={query}
            inputRef={inputRef}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#888", mr: 1 }} />,
              endAdornment: query && (
                <IconButton size="small" onClick={() => setQuery("")}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
          <div
            style={{
              width: 120,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoading ? (
              <Button
                variant="contained"
                color="success"
                disabled
                sx={{ whiteSpace: "nowrap" }}
              >
                <CircularProgress size={14} sx={{ mr: 1 }} />
                {searchMode === "isbn" ? "Adding..." : "Searching..."}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                type="submit"
                sx={{ whiteSpace: "nowrap" }}
              >
                {searchMode === "isbn" ? "Add Book" : "Search"}
              </Button>
            )}
          </div>
        </form>

        <Button
          variant="outlined"
          sx={{ color: "#505050", whiteSpace: "nowrap" }}
          onClick={() => setBookFormState("add")}
        >
          Add Book Manually
        </Button>
      </div>

      {/* Search results modal */}
      <Dialog
        open={results !== null}
        onClose={handleCloseResults}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select books to add</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {results && results.length > 0 ? (
            <>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {results.map((book, i) => (
                  <li
                    key={i}
                    onClick={() => handleToggleResult(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                      backgroundColor: selected.has(i)
                        ? "rgba(0,128,0,0.06)"
                        : "",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected.has(i))
                        e.currentTarget.style.backgroundColor =
                          "rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = selected.has(i)
                        ? "rgba(0,128,0,0.06)"
                        : "";
                    }}
                  >
                    <Checkbox
                      checked={selected.has(i)}
                      size="small"
                      sx={{ p: 0 }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleToggleResult(i)}
                    />
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt=""
                        style={{
                          width: 40,
                          height: 60,
                          objectFit: "cover",
                          flexShrink: 0,
                          borderRadius: 2,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 60,
                          flexShrink: 0,
                          backgroundColor: "rgba(0,0,0,0.08)",
                          borderRadius: 2,
                        }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 500 }}>{book.title}</div>
                      <div style={{ fontSize: "0.85em", opacity: 0.7 }}>
                        {book.author}
                        {book.year ? ` · ${book.year}` : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {hasMore && (
                <div style={{ padding: "10px 16px", textAlign: "center" }}>
                  <Button
                    size="small"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (
                      <>
                        <CircularProgress size={12} sx={{ mr: 1 }} />
                        Loading...
                      </>
                    ) : (
                      `Load more (${totalResults - results.length} remaining)`
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p style={{ padding: "16px" }}>No results.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResults}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            disabled={selected.size === 0}
            onClick={handleAddSelected}
          >
            Add {selected.size > 0 ? `${selected.size} ` : ""}
            {selected.size === 1 ? "Book" : "Books"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
