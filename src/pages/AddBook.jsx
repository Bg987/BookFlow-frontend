import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import ISBNForm from "../components/ISBNForm";
import BookForm from "../components/BookForm";
import fetchBookData from "../api/api";

const AddBook = ({ closeDrawer, isbn: prefillISBN }) => {
  const [isbn, setIsbn] = useState(prefillISBN || "");
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookData, setBookData] = useState({});
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    if (prefillISBN) {
      fetchBook(); // fetch automatically if ISBN was passed
    }
  }, [prefillISBN]);

  const fetchBook = async () => {
    if (!isbn) return alert("Please enter ISBN");
    setLoading(true);
    try {
      const res = await fetchBookData(isbn);
      setBookData(res.data);
      setManualMode(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert("Book not found. Please enter manually.");
        setManualMode(true);
        setBookData({ isbn });
      } else {
        alert("Something went wrong while fetching the book.");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveBook = async () => {
    if (!bookData.title) return alert("Please enter book title");
    setLoading(true);
    try {
      const formData = new FormData();
      for (let key in bookData) {
        if (Array.isArray(bookData[key])) {
          formData.append(key, JSON.stringify(bookData[key]));
        } else {
          formData.append(key, bookData[key]);
        }
      }
      formData.append("copies", copies);

      const res = await axios.post("http://localhost:5000/api/book/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Book saved successfully!");
      closeDrawer();
    } catch (err) {
      console.error(err);
      alert("Error saving book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {!manualMode && !bookData.title ? (
        <ISBNForm
          isbn={isbn}
          setIsbn={setIsbn}
          copies={copies}
          setCopies={setCopies}
          fetchBook={fetchBook}
          setManualMode={setManualMode}
          loading={loading}
        />
      ) : (
        <BookForm
          bookData={bookData}
          setBookData={setBookData}
          copies={copies}
          setCopies={setCopies}
          saveBook={saveBook}
          loading={loading}
        />
      )}
    </Box>
  );
};

export default AddBook;
