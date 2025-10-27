import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Drawer,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { LibrarianData } from "../api/api";
import LogoutButton from "../components/logout";
import LibraryInfoCard from "../components/LibraryProfile";
import LibrarianProfile from "../components/LibrarianProfile";
import AddBook from "../pages/AddBook";
import BookList from "../components/BookList";
import BookDetails from "../components/BookDetails";

const LibrarianDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [Library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [drawerOpenAddBook, setDrawerOpenAddBook] = useState(false);
  const [drawerOpenBookData, setDrawerOpenBookData] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Local book state (to trigger refresh in BookList)
  const [books, setBooks] = useState([]);

  // Fetch profile + library info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await LibrarianData();
        const data = res.data.Data;
        setProfile(data);
        setLibrary(data.library_data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  
  const handleBookUpdate = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.book_id === updatedBook.book_id ? updatedBook : b
      )
    );
  };

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        minHeight: "90vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0d47a1" }}>
          Welcome,{" "}
          {profile?.userData?.username ||
            profile?.librarian_data?.name ||
            "Librarian"}{" "}
          👋
        </Typography>
        <LogoutButton redirectTo="/" />
      </Box>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ my: 3 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDrawerOpenAddBook(true)}
          >
            Add Book
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setDrawerOpenBookData(true)}
          >
            Book Data
          </Button>
        </Grid>
      </Grid>

      {/* Dashboard content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : profile ? (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <LibrarianProfile
                librarian_data={profile?.librarian_data}
                userData={profile?.userData}
                loading={loading}
              />
              <LibraryInfoCard
                library={Library}
                extra="librarian"
                loading={loading}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography textAlign="center" mt={5}>
          Failed to load librarian data.
        </Typography>
      )}

      {/* Add Book Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpenAddBook}
        onClose={() => setDrawerOpenAddBook(false)}
        PaperProps={{ sx: { width: "100%", maxWidth: 800, p: 3, overflowY: "auto" } }}
      >
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <IconButton onClick={() => setDrawerOpenAddBook(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <AddBook closeDrawer={() => setDrawerOpenAddBook(false)} />
      </Drawer>

      {/* Book Data Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpenBookData}
        onClose={() => setDrawerOpenBookData(false)}
        PaperProps={{ sx: { width: "100%", maxWidth: 800, p: 3, overflowY: "auto" } }}
      >
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <IconButton onClick={() => setDrawerOpenBookData(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <BookList
          onBookClick={(book) => setSelectedBook(book)}
          books={books}
          setBooks={setBooks}
        />
      </Drawer>
      {/* Book Details Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        PaperProps={{ sx: { width: "100%", maxWidth: 800, p: 3, overflowY: "auto" } }}
      >
        {selectedBook && (
          <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <IconButton onClick={() => setSelectedBook(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <BookDetails
              bookData={selectedBook}
              closeDrawer={() => setSelectedBook(null)}
              onUpdate={handleBookUpdate} 
            />
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default LibrarianDashboard;
