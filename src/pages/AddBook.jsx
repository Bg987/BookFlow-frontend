import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import ISBNForm from "../components/ISBNForm";
import BookForm from "../components/BookForm";
import Message from "../components/Message";
import {fetchBookData} from "../api/api";

const AddBook = () => {
  const [isbn, setIsbn] = useState("");
  const [bookData, setBookData] = useState(null);
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBook = async () => {
    if (!isbn.trim()) {
      setMessage("Please enter ISBN.");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const res = await fetchBookData(isbn);  
      setBookData(res.data);
      setManualMode(false);
    } catch (err) {
      setMessage("Book not found. Enter manually.");
      setManualMode(true);
      setBookData(null);
    } finally {
      setLoading(false);
    }
  };

  const saveBook = async () => {
    if (!bookData || !bookData.title) {
      setMessage("Book title is required.");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const payload = { manualData: bookData, copies };
      const res = await api.post("/books/addBook", payload);
      setMessage(`Book "${res.title}" saved successfully!`);
      setBookData(null);
      setIsbn("");
      setCopies(1);
      setManualMode(false);
    } catch (err) {
      setMessage("Failed to save book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} direction="column" sx={{ maxWidth: 700, margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>Add Book</Typography>

      {!manualMode && !bookData && (
        <ISBNForm
          isbn={isbn}
          setIsbn={setIsbn}
          copies={copies}
          setCopies={setCopies}
          fetchBook={fetchBook}
          setManualMode={setManualMode}
          loading={loading}
        />
      )}

      {(bookData || manualMode) && (
        <BookForm
          bookData={bookData.data}
          setBookData={setBookData}
          copies={copies}
          setCopies={setCopies}
          saveBook={saveBook}
          loading={loading}
        />
      )}

      <Message text={message} />
    </Grid>
  );
};

export default AddBook;
