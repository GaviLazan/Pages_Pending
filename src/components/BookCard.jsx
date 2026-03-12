import { useState, useRef, useEffect, forwardRef } from "react";
import lendLengthCalc from "../utils/lendLengthCalc.js";
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
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Slide from "@mui/material/Slide";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Skeleton from "@mui/material/Skeleton";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lentDate, setLentDate] = useState(dayjs().toISOString().split("T")[0]);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(!!book.coverUrl);
  const [imageLoaded, setImageLoaded] = useState(false);

  const inputRef = useRef(null);

  // overdue indicator
  const lentPercent = book.isLent ? lendLengthCalc(book.lentDate) / 100 : 0;
  const overdueBarHeight =
    book.isLent && lentPercent > 0 ? 2 + lentPercent * 8 : 0;

  // status menu
  const handleStatusMenuOpen = (e) => setStatusAnchor(e.currentTarget);
  const handleStatusMenuClose = () => setStatusAnchor(null);
  const handleStatusChange = (newStatus) => {
    onStatusChange(book.id, newStatus);
    handleStatusMenuClose();
  };
  const statusColors = {
    null: "#888888",
    tbr: "#8b6914",
    reading: "#1e5a99",
    read: "#2e7d32",
    dnf: "#c62828",
  };

  const statusLabels = {
    null: "Set Status",
    tbr: "TBR",
    reading: "Reading",
    read: "Read",
    dnf: "DNF",
  };

  // book lend logic
  const handleSubmitLend = (e) => {
    e.preventDefault();
    if (lentTo === "") {
      setLendError("Please enter a borrower name");
      return;
    }
    onLendBook(book.id, lentTo, lentDate);
    setShowLendForm(false);
  };

  // skeleton timeout — show placeholder after 8s if image hasn't loaded
  useEffect(() => {
    if (!book.coverUrl) return;
    const timer = setTimeout(() => setShowSkeleton(false), 8000);
    return () => clearTimeout(timer);
  }, [book.coverUrl]);

  // input focus
  useEffect(() => {
    if (showLendForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showLendForm]);

  return (
    <Card
      className={`book-card ${book.isLent ? "lent" : ""}`}
      data-status={book.status}
      sx={{
        overflow: "visible",
        borderRadius: book.isLent && lentPercent > 0 ? "0 0 8px 8px" : "8px",
      }}
    >
      {/* overdue indicator */}
      <div
        style={{
          position: "absolute",
          top: `-${overdueBarHeight}px`,
          left: 0,
          right: 0,
          height: `${overdueBarHeight}px`,
          backgroundColor: "red",
          borderRadius: "4px 4px 0 0",
          zIndex: -1,
        }}
      />

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

      {/* book cover */}
      {showSkeleton && (
        <Skeleton variant="rectangular" width={180} height={270} />
      )}
      {book.coverUrl && !imageError && (
        <CardMedia
          component="img"
          sx={{ height: 270, objectFit: "fill" }}
          image={book.coverUrl}
          alt={book.title}
          onLoad={() => {
            setShowSkeleton(false);
            setImageLoaded(true);
          }}
          onError={() => {
            setShowSkeleton(false);
            setImageError(true);
          }}
          style={{ display: imageLoaded ? "block" : "none" }}
        />
      )}
      {(!book.coverUrl || imageError || (!showSkeleton && !imageLoaded)) && (
        <div className="cover-placeholder">{book.title}</div>
      )}

      {/* book info */}
      <CardContent
        sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        {/* title */}
        <Tooltip title={book.title}>
          <h3 dir="auto">{book.title}</h3>
        </Tooltip>

        {/* author/lent to */}
        {book.isLent ? (
          <Tooltip
            title={`Lent to ${book.lentTo} on ${new Date(book.lentDate).toLocaleDateString("en-GB")}`}
          >
            <p dir="auto">
              Lent to: {book.lentTo} on{" "}
              {new Date(book.lentDate).toLocaleDateString("en-GB")}
            </p>
          </Tooltip>
        ) : (
          <Tooltip title={book.author}>
            <p dir="auto">{book.author}</p>
          </Tooltip>
        )}

        {/* ratings */}
        <div className="rating-box"><Rating
          sx={{
            fontSize: "1.1rem",
            paddingTop: "5px",
          }}
          value={book.rating}
          onChange={(e, newValue) => onRatingChange(book.id, newValue)}
        />
</div>
        {/* status menu */}
        <div className="status-button">
          <Button
            variant="text"
            size="small"
            onClick={handleStatusMenuOpen}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              color: statusColors[book.status] || statusColors[null],
              borderColor: statusColors[book.status] || statusColors[null],
              width: "135px",
              display: "flex",
            }}
          >
            {statusLabels[book.status] || statusLabels[null]}
          </Button>
        </div>
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

        {/* icon buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            gap: "8px",
            marginTop: "0",
          }}
        >
          {/* edit */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton
              sx={{ padding: "1px" }}
              onClick={() => setBookFormState(book)}
            >
              <EditNoteOutlinedIcon />
            </IconButton>
            <span style={{ fontSize: "12px" }}>Edit</span>
          </div>

          {/* lend */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {book.isLent ? (
              <IconButton
                sx={{ padding: "1px" }}
                onClick={() => {
                  onReturnBook(book.id);
                  setLentDate(dayjs().toISOString().split("T")[0]);
                  setLentTo("");
                }}
              >
                <FileDownloadOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton
                sx={{ padding: "1px" }}
                onClick={() => setShowLendForm(true)}
              >
                <FileUploadOutlinedIcon />
              </IconButton>
            )}
            <span style={{ fontSize: "12px" }}>
              {book.isLent ? "Return" : "Lend"}
            </span>
          </div>

          {/* lend form */}
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
                <form id="lend-form" onSubmit={handleSubmitLend}>
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
                {" "}
                <Button
                  form="lend-form"
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

          {/* delete */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="delete"
              sx={{ padding: "1px" }}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
            <span style={{ fontSize: "12px" }}>Delete</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
