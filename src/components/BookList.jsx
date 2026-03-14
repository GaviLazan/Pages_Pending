import { useState, useRef, useEffect, forwardRef, memo } from "react";
import Checkbox from "@mui/material/Checkbox";
import lendLengthCalc from "../utils/lendLengthCalc.js";
import { lightStatusColors, darkStatusColors } from "../utils/statusColors";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Rating from "@mui/material/Rating";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Tooltip from "@mui/material/Tooltip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import dayjs from "dayjs";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const lightStatusBg = {
  tbr: "hsl(46, 100%, 95%)",
  reading: "hsl(218, 100%, 93%)",
  read: "hsl(153, 31%, 90%)",
  dnf: "#f8d7da",
};

const darkStatusBg = {
  tbr: "rgba(255, 209, 102, 0.17)",
  reading: "rgba(96, 171, 255, 0.17)",
  read: "rgba(93, 214, 104, 0.17)",
  dnf: "rgba(255, 107, 107, 0.17)",
};

const statusLabels = {
  null: "Set Status",
  tbr: "TBR",
  reading: "Reading",
  read: "Read",
  dnf: "DNF",
};

const BookListRow = memo(function BookListRow({
  book,
  onDelete,
  onStatusChange,
  onLendBook,
  onReturnBook,
  onRatingChange,
  setBookFormState,
  darkMode,
  isSelected,
  onToggleSelect,
  isSelectionMode,
}) {
  const [imageError, setImageError] = useState(false);
  const [showLendForm, setShowLendForm] = useState(false);
  const [lentTo, setLentTo] = useState("");
  const [lendError, setLendError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lentDate, setLentDate] = useState(dayjs().toISOString().split("T")[0]);
  const [statusAnchor, setStatusAnchor] = useState(null);

  const inputRef = useRef(null);
  const statusColors = darkMode ? darkStatusColors : lightStatusColors;

  const lentPercent = book.isLent ? lendLengthCalc(book.lentDate) / 100 : 0;
  const overdueBarWidth =
    book.isLent && lentPercent > 0 ? 2 + lentPercent * 6 : 0;

  const statusBg = book.isLent
    ? undefined
    : darkMode
      ? darkStatusBg[book.status]
      : lightStatusBg[book.status];

  const handleStatusMenuOpen = (e) => setStatusAnchor(e.currentTarget);
  const handleStatusMenuClose = () => setStatusAnchor(null);
  const handleStatusChange = (newStatus) => {
    onStatusChange(book.id, newStatus);
    handleStatusMenuClose();
  };

  const handleSubmitLend = (e) => {
    e.preventDefault();
    if (lentTo === "") {
      setLendError("Please enter a borrower name");
      return;
    }
    onLendBook(book.id, lentTo, lentDate);
    setShowLendForm(false);
  };

  useEffect(() => {
    if (showLendForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showLendForm]);

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "12px",
        padding: "8px 12px",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
        backgroundColor: book.isLent ? "#a3a3a35e" : statusBg || undefined,
        borderLeft:
          overdueBarWidth > 0 ? `${overdueBarWidth}px solid red` : undefined,
        outline: isSelected ? "2px solid" : "none",
        outlineColor: "primary.main",
        outlineOffset: "2px",
        transition: "outline 0.1s ease",
      }}
    >
      {/* delete dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
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

      {isSelectionMode && (
        <Checkbox
          checked={!!isSelected}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(book.id);
          }}
          sx={{ flexShrink: 0, padding: "4px" }}
        />
      )}

      {/* thumbnail */}
      <div
        onClick={() => onToggleSelect(book.id)}
        style={{
          width: 48,
          height: 64,
          flexShrink: 0,
          borderRadius: 4,
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {book.coverUrl && !imageError ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            onError={() => setImageError(true)}
            style={{
              width: 48,
              height: 64,
              objectFit: "fill",
              display: "block",
              filter: book.isLent ? "grayscale(1)" : undefined,
              opacity: book.isLent ? 0.4 : 1,
            }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 64,
              background: "#9575cd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              fontWeight: 600,
              color: "#000",
              textAlign: "center",
              padding: "4px",
              filter: book.isLent ? "grayscale(1)" : undefined,
              opacity: book.isLent ? 0.4 : 1,
            }}
          >
            {book.title}
          </div>
        )}
      </div>

      {/* title + author/lent info */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          dir="auto"
          style={{
            fontWeight: 600,
            fontSize: "13px",
            opacity: book.isLent ? 0.5 : 1,
            overflowWrap: "break-word",
          }}
        >
          {book.title}
        </div>
        <div
          dir="auto"
          style={{
            fontSize: "12px",
            color: "var(--mui-palette-text-secondary)",
            overflowWrap: "break-word",
          }}
        >
          {book.isLent
            ? `Lent to: ${book.lentTo} on ${new Date(book.lentDate).toLocaleDateString("en-GB")}`
            : book.author}
        </div>
      </div>

      {/* status button */}
      <Button
        variant="text"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleStatusMenuOpen(e);
        }}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          color:
            book.isLent && darkMode && !book.status
              ? "rgba(255, 255, 255, 0.65)"
              : statusColors[book.status] || statusColors[null],
          width: "120px",
          flexShrink: 0,
        }}
      >
        {statusLabels[book.status] || statusLabels[null]}
      </Button>
      <Menu
        anchorEl={statusAnchor}
        open={Boolean(statusAnchor)}
        onClose={handleStatusMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange(null)}>
          Clear Status
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange("tbr")}>
          To Be Read
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange("reading")}>
          Currently Reading
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange("read")}>Read</MenuItem>
        <MenuItem onClick={() => handleStatusChange("dnf")}>
          Did Not Finish
        </MenuItem>
      </Menu>

      {/* rating */}
      <div onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0 }}>
        <Rating
          size="small"
          value={book.rating}
          onChange={(e, newValue) => onRatingChange(book.id, newValue)}
        />
      </div>

      {/* action icons */}
      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setBookFormState(book);
          }}
        >
          <EditNoteOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {book.isLent ? (
        <Tooltip title="Return">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onReturnBook(book.id);
              setLentDate(dayjs().toISOString().split("T")[0]);
              setLentTo("");
            }}
          >
            <FileDownloadOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Lend">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setShowLendForm(true);
            }}
          >
            <FileUploadOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* lend form dialog */}
      {!book.isLent && (
        <Dialog
          open={showLendForm}
          slots={{ transition: Transition }}
          onClose={() => {
            setShowLendForm(false);
            setLentTo("");
            setLendError("");
            setLentDate(dayjs().toISOString().split("T")[0]);
          }}
        >
          <DialogTitle>Lend a book</DialogTitle>
          <DialogContent>
            <form
              id={`lend-form-${book.id}`}
              style={{ paddingTop: 7 }}
              onSubmit={handleSubmitLend}
            >
              <TextField
                label="Lend to:"
                type="text"
                inputRef={inputRef}
                value={lentTo}
                onChange={(e) => setLentTo(e.target.value)}
                placeholder="Who is borrowing the book?"
              />
              <DatePicker
                label="Lent on"
                value={lentDate ? dayjs(lentDate) : dayjs()}
                onChange={(newValue) =>
                  setLentDate(newValue.format("YYYY-MM-DD"))
                }
              />
              {lendError && <Alert severity="warning">{lendError}</Alert>}
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              form={`lend-form-${book.id}`}
              variant="contained"
              color="success"
              type="submit"
            >
              Save
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setShowLendForm(false);
                setLentTo("");
                setLendError("");
                setLentDate(dayjs().toISOString().split("T")[0]);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Tooltip title="Delete">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteDialogOpen(true);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
});

export default function BookList({
  books,
  onDelete,
  onStatusChange,
  onLendBook,
  onReturnBook,
  onRatingChange,
  setBookFormState,
  darkMode,
  selectedBooks,
  onToggleSelect,
  isSelectionMode,
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}
    >
      {books.map((book) => (
        <BookListRow
          key={book.id}
          book={book}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onLendBook={onLendBook}
          onReturnBook={onReturnBook}
          onRatingChange={onRatingChange}
          setBookFormState={setBookFormState}
          darkMode={darkMode}
          isSelected={selectedBooks.has(book.id)}
          onToggleSelect={onToggleSelect}
          isSelectionMode={isSelectionMode}
        />
      ))}
    </div>
  );
}
