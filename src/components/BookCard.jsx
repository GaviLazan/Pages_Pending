import { useState, useRef, useEffect } from "react";
import lendLengthCalc from "../utils/lendLengthCalc.js";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Rating from "@mui/material/Rating";

export default function BookCard({
  book,
  onDelete,
  onStatusChange,
  onLendBook,
  onReturnBook,
  onRatingChange,
  setBookFormState,
}) {
  const [imageError, setImageError] = useState(false);
  const [showLendForm, setShowLendForm] = useState(false);
  const [lentTo, setLentTo] = useState("");
  const [lendError, setLendError] = useState("");
  const inputRef = useRef(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const lentPercent = book.isLent ? lendLengthCalc(book.lentDate) / 100 : 0;

  const handleStatusChange = (e) => {
    onStatusChange(book.id, e.target.value);
  };

  // console.log("BookCard render:", {
  //   title: book.title,
  //   coverUrl: book.coverUrl,
  //   imageError,
  // });

  const handleSubmitLend = (e) => {
    e.preventDefault();
    if (lentTo === "") {
      setLendError("Please enter a borrower name");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    onLendBook(book.id, lentTo, today);
    setShowLendForm(false);
  };

  useEffect(() => {
    if (showLendForm) {
      inputRef.current.focus();
    }
  }, [showLendForm]);

  return (
    <div
      className={`book-card ${book.isLent ? "lent" : ""}`}
      data-status={book.status}
      style={{ boxShadow: `0 0 20px 0 rgba(255, 0, 0, ${lentPercent})` }}
    >
      <IconButton aria-label="delete" onClick={() => setDeleteDialogOpen(true)}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={deleteDialogOpen}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this book?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onDelete(book.id);
              setDeleteDialogOpen(false);
            }}
          >
            Delete
          </Button>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Button variant="outlined" onClick={() => setBookFormState(book)}>
        Edit
      </Button>
      {book.coverUrl && !imageError ? (
        <img
          src={book.coverUrl}
          alt={book.title}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="cover-placeholder">{book.title}</div>
      )}
      <h3 dir="auto">{book.title}</h3>
      {book.isLent ? (
        <p dir="auto">
          Lent to: {book.lentTo} on{" "}
          {new Date(book.lentDate).toLocaleDateString("en-GB")}
        </p>
      ) : (
        <p dir="auto">{book.author}</p>
      )}
      <Rating
        value={book.rating}
        onChange={(e, newValue) => onRatingChange(book.id, newValue)}
      />
      <Select
        className="status-select"
        value={book.status || "null"}
        onChange={handleStatusChange}
      >
        <MenuItem value="null">No Status</MenuItem>
        <MenuItem value="tbr">TBR</MenuItem>
        <MenuItem value="reading">Currently Reading</MenuItem>
        <MenuItem value="read">Read</MenuItem>
        <MenuItem value="dnf">DNF</MenuItem>
      </Select>
      {!book.isLent && !showLendForm && (
        <Button variant="contained" onClick={() => setShowLendForm(true)}>
          Lend Book
        </Button>
      )}
      {!book.isLent && showLendForm && (
        <form onSubmit={handleSubmitLend}>
          <TextField
            label="Lend to:"
            variant="filled"
            type="text"
            inputRef={inputRef}
            value={lentTo}
            onChange={(e) => setLentTo(e.target.value)}
            placeholder="Who is borrowing the book?"
          />
          {lendError && <Alert severity="warning">{lendError}</Alert>}
          <Button variant="contained" color="success" type="submit">
            Save
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowLendForm(false);
              setLentTo("");
              setLendError("");
            }}
          >
            Cancel
          </Button>
        </form>
      )}
      {book.isLent && (
        <Button
          variant="contained"
          color="info"
          onClick={() => onReturnBook(book.id)}
        >
          Return Book
        </Button>
      )}
    </div>
  );
}
