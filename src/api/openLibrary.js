import axios from "axios";

export async function fetchBookByISBN(isbn) {
  // Step 1: Fetch the book data from Open Library
  try {
    const bookResponse = await axios.get(
      `https://openlibrary.org/isbn/${isbn}.json`,
      { headers: { "User-Agent": undefined } },
    );
    const bookData = bookResponse.data;
    // Step 2: Extract title from the response
    const title = bookData.title;
    // Step 3: Extract author (with fallback to 'Unknown Author')
    let authorName = "Unknown Author";

    if (bookData.authors && bookData.authors.length > 0) {
      const authorKey = bookData.authors[0].key;
      const authorResponse = await axios.get(
        `https://openlibrary.org${authorKey}.json`,
      );
      authorName = authorResponse.data.name;
    } else if (bookData.works && bookData.works.length > 0) {
      const workKey = bookData.works[0].key;
      const workResponse = await axios.get(
        `https://openlibrary.org${workKey}.json`,
      );

      if (workResponse.data.authors && workResponse.data.authors.length > 0) {
        const authorKey = workResponse.data.authors[0].author.key;
        const authorResponse = await axios.get(
          `https://openlibrary.org${authorKey}.json`,
        );
        authorName = authorResponse.data.name;
      }
    }
    // Step 4: Build the cover URL
    let coverUrl = "";

    if (bookData.covers && bookData.covers.length > 0) {
      const coverId = bookData.covers[0];
      coverUrl = `http://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    }

    // Step 5: Return an object with title, author, coverUrl, isbn
    return {
      title: title,
      author: authorName,
      coverUrl: coverUrl,
      isbn: isbn,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error fetching book:", error);
    }
    throw error;
  }
}
