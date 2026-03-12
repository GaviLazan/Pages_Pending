import { useState } from "react";
import lendLengthAsString from "../utils/lendLengthAsString";
import lendLengthCalc from "../utils/lendLengthCalc";

export default function LentStatusPanel({ books }) {
  const [sortBy, setSortBy] = useState("title");
  const lentBooks = books.filter((book) => book.isLent);

  const sortedLentBooks = [...lentBooks].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "name") return a.lentTo.localeCompare(b.lentTo);
    if (sortBy === "length")
      return lendLengthCalc(a.lentDate) - lendLengthCalc(b.lentDate);
  });

  return (
    <div className="lent-panel">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <h3 style={{ margin: 0 }}>On Loan</h3>
        <span style={{ fontSize: "12px", color: "#507993" }}>
          Sort by:{" "}
          {["title", "name", "length"].map((option) => (
            <span
              key={option}
              onClick={() => setSortBy(option)}
              style={{
                cursor: "pointer",
                marginLeft: "6px",
                fontWeight: sortBy === option ? 600 : 400,
                textDecoration: sortBy === option ? "underline" : "none",
              }}
            >
              {option}
            </span>
          ))}
        </span>
      </div>
      {lentBooks.length === 0 && (
        <p style={{ color: "#6b6b6b", fontSize: "13px" }}>
          No books currently on loan
        </p>
      )}
      {sortedLentBooks.map((book) => (
        <div key={book.id} style={{ marginBottom: "12px" }}>
          <strong>{book.title}</strong>
          <p
            className="lent-stat-name"
            style={{ color: "#6b6b6b", fontSize: "13px", margin: 0 }}
          >
            Lent to {book.lentTo} {lendLengthAsString(book.lentDate)}
          </p>
        </div>
      ))}
    </div>
  );
}
