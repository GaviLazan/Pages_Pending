import { useState, useRef, useEffect } from "react";
import { fetchBookByISBN } from "../api/openLibrary";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

export default function AddBookForm({ onAddBook }) {
  const [isbn, setIsbn] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isbn.trim()) {
      setErrorMessage("Please enter an ISBN");
      return;
    }

    try {
      const bookData = await fetchBookByISBN(isbn);
      onAddBook(bookData);
      setIsbn("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`Error adding book: ${error.message}`);
      return;
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Enter ISBN"
        variant="filled"
        value={isbn}
        inputRef={inputRef}
        onChange={(e) => {
          setIsbn(e.target.value);
          setErrorMessage("");
        }}
      />
      <Button variant="contained" color="success" type="submit">
        Add Book
      </Button>
      {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
    </form>
  );
}
