import lendLengthAsString from "../utils/lendLengthAsString";

export default function LentStatusPanel({ books }) {
  const lentBooks = books.filter((book) => book.isLent);

  return (
    <div>
      {lentBooks.map((book) => (
        <p
          key={book.id}
        >{`${book.title} - lent to ${book.lentTo} ${lendLengthAsString(book.lentDate)}`}</p>
      ))}
    </div>
  );
}
