import { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

export default function BookFormModal({
  onAddBook,
  onEditBook,
  bookFormState,
  setBookFormState,
}) {
  const [title, setTitle] = useState(bookFormState?.title || "");
  const [author, setAuthor] = useState(bookFormState?.author || "");
  const [coverUrl, setCoverUrl] = useState(bookFormState?.coverUrl || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [lentTo, setLentTo] = useState(bookFormState?.lentTo || "");
  const [lentDate, setLentDate] = useState(bookFormState?.lentDate || "");
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() && !author.trim()) {
      setErrorMessage("Please enter title and author name.");
      return;
    } else if (!author.trim()) {
      setErrorMessage("Please enter author name.");
      return;
    } else if (!title.trim()) {
      setErrorMessage("Please enter title.");
      return;
    } else if (coverUrl) {
      const img = new Image();
      img.onload = () => {
        if (bookFormState === "add") {
          onAddBook({ title, author, coverUrl, isbn: "" });
          setTitle("");
          setAuthor("");
          setCoverUrl("");
          setErrorMessage("");
        } else {
          const updatedData = { title, author, coverUrl, lentTo, lentDate };
          onEditBook(bookFormState.id, updatedData);
          setBookFormState(null);
        }
      };
      img.onerror = () => {
        setErrorMessage("Please paste valid image link.");
      };
      img.src = coverUrl;
      return;
    }
    if (bookFormState === "add") {
      const bookData = { title, author, coverUrl, isbn: "" };
      onAddBook(bookData);
      setTitle("");
      setAuthor("");
      setCoverUrl("");
      setErrorMessage("");
    } else {
      const updatedData = { title, author, coverUrl, lentTo, lentDate };
      onEditBook(bookFormState.id, updatedData);
      setBookFormState(null);
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        variant="filled"
        value={title}
        ref={inputRef}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        variant="filled"
        label="Author Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <TextField
        variant="filled"
        label="Cover URL"
        value={coverUrl}
        onChange={(e) => setCoverUrl(e.target.value)}
      />
      {bookFormState?.isLent === true && (
        <div>
          <TextField
            variant="filled"
            label="Lent to:"
            defaultValue={lentTo}
            onChange={(e) => setLentTo(e.target.value)}
          />
          <TextField
            variant="filled"
            label="Lent on:"
            defaultValue={lentDate}
            onChange={(e) => setLentDate(e.target.value)}
          />
        </div>
      )}
      <Button variant="contained" color="success" type="submit">
        {bookFormState !== "add" ? "Save Changes" : "Add Book"}
      </Button>
      <Button variant="contained" onClick={() => setBookFormState(null)}>
        Cancel
      </Button>
      {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
    </form>
  );
}
