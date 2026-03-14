import { useState, forwardRef } from "react";
import dayjs from "dayjs";

import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import Divider from "@mui/material/Divider";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BulkActionBar({
  selectedBooks,
  books,
  onDeselectAll,
  onBulkDelete,
  onBulkStatusChange,
  onBulkLend,
  onBulkReturn,
  darkMode,
}) {
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [bulkLendOpen, setBulkLendOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [lentTo, setLentTo] = useState("");
  const [lentDate, setLentDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [lendError, setLendError] = useState("");

  const count = selectedBooks.size;
  const selectedBookObjects = books.filter((b) => selectedBooks.has(b.id));
  const lentCount = selectedBookObjects.filter((b) => b.isLent).length;
  const notLentCount = count - lentCount;

  function handleLendSubmit(e) {
    e.preventDefault();
    if (!lentTo.trim()) {
      setLendError("Please enter a borrower name");
      return;
    }
    onBulkLend(lentTo.trim(), lentDate);
    setBulkLendOpen(false);
    setLentTo("");
    setLentDate(dayjs().format("YYYY-MM-DD"));
    setLendError("");
  }

  function closeLendDialog() {
    setBulkLendOpen(false);
    setLentTo("");
    setLentDate(dayjs().format("YYYY-MM-DD"));
    setLendError("");
  }

  return (
    <>
      <Slide direction="up" in={count > 0} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 75,
            left: 0,
            right: 0,
            marginLeft: "auto",
            marginRight: "auto",
            width: "fit-content",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "10px 16px",
            borderRadius: "32px",
            justifyContent: "center",
            backgroundColor: darkMode ? "#2a2a3d" : "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          {/* left: deselect + count */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <IconButton
              size="small"
              onClick={onDeselectAll}
              title="Deselect all"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ whiteSpace: "nowrap" }}
            >
              {count} selected
            </Typography>
          </div>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* right: actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            <Button
              size="small"
              startIcon={<LabelOutlinedIcon />}
              onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
            >
              Status
            </Button>

            {notLentCount > 0 && (
              <Button
                size="small"
                startIcon={<FileUploadOutlinedIcon />}
                onClick={() => setBulkLendOpen(true)}
              >
                Lend
              </Button>
            )}

            {lentCount > 0 && (
              <Button
                size="small"
                startIcon={<FileDownloadOutlinedIcon />}
                onClick={onBulkReturn}
              >
                Return
              </Button>
            )}

            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setBulkDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </Paper>
      </Slide>

      {/* status menu — opens upward */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={() => setStatusMenuAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MenuItem
          onClick={() => {
            onBulkStatusChange(null);
            setStatusMenuAnchor(null);
          }}
        >
          Clear Status
        </MenuItem>
        <MenuItem
          onClick={() => {
            onBulkStatusChange("tbr");
            setStatusMenuAnchor(null);
          }}
        >
          To Be Read
        </MenuItem>
        <MenuItem
          onClick={() => {
            onBulkStatusChange("reading");
            setStatusMenuAnchor(null);
          }}
        >
          Currently Reading
        </MenuItem>
        <MenuItem
          onClick={() => {
            onBulkStatusChange("read");
            setStatusMenuAnchor(null);
          }}
        >
          Read
        </MenuItem>
        <MenuItem
          onClick={() => {
            onBulkStatusChange("dnf");
            setStatusMenuAnchor(null);
          }}
        >
          Did Not Finish
        </MenuItem>
      </Menu>

      {/* bulk lend dialog */}
      <Dialog
        open={bulkLendOpen}
        slots={{ transition: Transition }}
        onClose={closeLendDialog}
      >
        <DialogTitle>
          Lend {notLentCount} book{notLentCount !== 1 ? "s" : ""}
        </DialogTitle>
        <DialogContent>
          <form
            id="bulk-lend-form"
            style={{ paddingTop: 7 }}
            onSubmit={handleLendSubmit}
          >
            <TextField
              label="Lend to:"
              type="text"
              autoFocus
              value={lentTo}
              onChange={(e) => setLentTo(e.target.value)}
              placeholder="Who is borrowing the books?"
              fullWidth
              sx={{ mb: 2 }}
            />
            <DatePicker
              label="Lent on"
              value={lentDate ? dayjs(lentDate) : dayjs()}
              onChange={(newValue) =>
                setLentDate(newValue.format("YYYY-MM-DD"))
              }
            />
            {lendError && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                {lendError}
              </Alert>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            form="bulk-lend-form"
            variant="contained"
            color="success"
            type="submit"
          >
            Save
          </Button>
          <Button variant="contained" onClick={closeLendDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* bulk delete confirmation */}
      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)}>
        <DialogTitle>
          Delete {count} book{count !== 1 ? "s" : ""}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete {count} selected book
            {count !== 1 ? "s" : ""}. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onBulkDelete();
              setBulkDeleteOpen(false);
            }}
          >
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
