import { useState, useRef, useEffect, forwardRef } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [validatingImage, setValidatingImage] = useState(false);
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
        setValidatingImage(false);
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
        setValidatingImage(false);
        setErrorMessage("Please paste valid image link.");
      };
      setValidatingImage(true);
      setTimeout(() => {
        img.src = coverUrl;
      }, 0);
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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Dialog
      open={bookFormState !== null}
      slots={{ transition: Transition }}
      transitionDuration={{ enter: 150, exit: 300 }}
      onClose={() => setBookFormState(null)}
    >
      <DialogTitle>
        {bookFormState !== "add" ? "Edit Book Info" : "Add Book"}
      </DialogTitle>
      <DialogContent>
        <form
          id="book-form"
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minWidth: "380px",
          }}
        >
          <TextField
            label="Title"
            value={title}
            ref={inputRef}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <TextField
            label="Cover URL"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
          />
          {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
          {bookFormState?.isLent === true && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <TextField
                label="Lent to:"
                defaultValue={lentTo}
                onChange={(e) => setLentTo(e.target.value)}
              />
              <DatePicker
                label="Lent on"
                value={lentDate ? dayjs(lentDate) : dayjs()}
                onChange={(newValue) =>
                  setLentDate(newValue.format("YYYY-MM-DD"))
                }
              />
            </div>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        {validatingImage ? (
          <Button variant="contained" disabled>
            <CircularProgress size={14} color="inherit" sx={{ mr: 1 }} />
            {bookFormState !== "add" ? "Saving..." : "Adding Book"}
          </Button>
        ) : (
          <Button
            form="book-form"
            variant="contained"
            color="success"
            type="submit"
          >
            {bookFormState !== "add" ? "Save Changes" : "Add Book"}
          </Button>
        )}
        <Button variant="contained" onClick={() => setBookFormState(null)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
