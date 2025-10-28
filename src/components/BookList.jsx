import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { getBooks } from "../api/api";

const BookList = ({ onBookClick }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState("alphabetical");
  const observer = useRef();

  // ✅ Fetch books from API
  const fetchBooks = async (pageToLoad = 1, reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await getBooks({
        page: pageToLoad,
        limit: 6,
        sort: sortOption,
      });

      const fetchedBooks = response.data.books || response.data || [];

      if (reset) {
        setBooks(fetchedBooks);
        setHasMore(fetchedBooks.length > 0);
      } else {
        setBooks((prev) => [...prev, ...fetchedBooks]);
        setHasMore(fetchedBooks.length > 0);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 When sort option changes → reset page, data, and fetch again
  useEffect(() => {
    setPage(1);
    setBooks([]);
    setHasMore(true);
    fetchBooks(1, true);
  }, [sortOption]);

  // 📦 Fetch next page when page increases
  useEffect(() => {
    if (page === 1) return; // already loaded in reset
    fetchBooks(page);
  }, [page]);

  // 📲 Initial load
  useEffect(() => {
    fetchBooks(1, true);
  }, []);

  // 🔁 Manual refresh button
  const handleRefresh = () => {
    setPage(1);
    setBooks([]);
    setHasMore(true);
    fetchBooks(1, true);
  };

  // 📜 Infinite scroll observer
  const lastBookRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">📚 Book List</Typography>
        <Button variant="outlined" onClick={handleRefresh}>
          Refresh
        </Button>
      </Box>

      {/* 🔽 Sorting Dropdown */}
      <Box mb={3}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            label="Sort By"
            onChange={(e) => setSortOption(e.target.value)}
          >
            <MenuItem value="alphabetical">Alphabetical (A-Z)</MenuItem>
            <MenuItem value="date">Newest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 📚 Book Grid */}
      <Grid container spacing={2}>
        {books.length > 0 ? (
          books.map((book, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={book._id || index}
              ref={index === books.length - 1 ? lastBookRef : null}
            >
              <Card
                onClick={() => onBookClick(book)}
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  transition: "0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2">
                    Author: {book.authors?.join(", ") || "Unknown"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Added: {new Date(book.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          !loading && <Typography>No books found</Typography>
        )}
      </Grid>

      {/* ⏳ Loader */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {/* ✅ End message */}
      {!hasMore && !loading && books.length > 0 && (
        <Typography textAlign="center" mt={2}>
          🎉 All books loaded
        </Typography>
      )}
    </Box>
  );
};

export default BookList;
