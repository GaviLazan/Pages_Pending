import BookCard from "./BookCard";

export default function BookGrid({
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
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          book={book}
          key={book.id}
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
