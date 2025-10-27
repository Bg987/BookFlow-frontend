import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import { getBooks } from "../api/api";

const BookList = ({ onBookClick, books, setBooks }) => {
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data.books || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch only if parent doesn't already have data
  useEffect(() => {
    if (!books || books.length === 0) {
      fetchBooks();
    } else {
      setLoading(false);
    }
  }, []); // fetch once

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h5" mb={2} sx={{ fontWeight: "bold" }}>
        All Books in Library
      </Typography>

      {(!books || books.length === 0) ? (
        <Typography>No books found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.book_id}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="body2">ISBN: {book.isbn}</Typography>
                  <Typography variant="body2">
                    Copies: {book.copies}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => onBookClick(book)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BookList;
