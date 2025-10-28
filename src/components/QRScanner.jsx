import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { getBookDetails } from "../api/api";
import LibraryInfoCard from "./LibraryProfile"; // ✅ import here

const QRScanner = ({ open }) => {
  const [scannedData, setScannedData] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scannerRef = useRef(null);

  // 🎯 Start scanning when Drawer opens
  useEffect(() => {
    if (!open) return;

    const initScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          setError("No camera found. Try uploading an image instead.");
          return;
        }

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            html5QrCode.stop().then(() => {
              setScannedData(decodedText);
            });
          },
          (scanError) => console.warn("Scanning error:", scanError)
        );
      } catch (err) {
        console.error("Camera init error:", err);
        setError("Camera permission denied or unavailable.");
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [open]);

  // 🚀 Fetch book details after QR is scanned
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!scannedData) return;
      setLoading(true);
      setError("");
      try {
        const response = await getBookDetails(scannedData);
        setBookData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch book details. Invalid QR or server error.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [scannedData]);

  // 🖼 Manual image upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const html5QrCode = new Html5Qrcode("reader");
      const result = await html5QrCode.scanFile(file, true);
      setScannedData(result);
    } catch (err) {
      console.error("Image scan error:", err);
      setError("Failed to read QR from image.");
    }
  };

  // 🔄 Restart scanner (no reload)
  const handleScanAnother = async () => {
    setScannedData(null);
    setBookData(null);
    setError("");

    if (scannerRef.current) {
      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            scannerRef.current.stop().then(() => {
              setScannedData(decodedText);
            });
          }
        );
      } catch (err) {
        console.error("Restart error:", err);
        setError("Unable to restart camera.");
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        📷 Scan or Upload QR
      </Typography>

      {!scannedData && (
        <>
          <Box
            id="reader"
            sx={{
              width: 320,
              height: 320,
              border: "2px solid #ccc",
              borderRadius: 2,
              mx: "auto",
            }}
          />
          <Box textAlign="center" mt={2}>
            <Button variant="outlined" component="label">
              Upload QR Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
        </>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center" mt={2}>
          {error}
        </Typography>
      )}

      {bookData && (
        <Paper elevation={4} sx={{ mt: 3, p: 3, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            📘 {bookData.book.title}
          </Typography>

          <Grid container spacing={3}>
            {/* Book Cover */}
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 2 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <img
                    src={bookData.book.cover}
                    alt="Book Cover"
                    style={{
                      width: "100%",
                      maxHeight: "350px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Book + Librarian + Library */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  {/* Book details (filtered fields) */}
                  {Object.entries(bookData.book)
                    .filter(
                      ([key]) =>
                        ![
                          "_id",
                          "book_id",
                          "library_id",
                          "librarian_id",
                          "__v",
                          "qrCodeUrl",
                          "createdAt",
                          "updatedAt",
                          "copies",
                          "cover",
                        ].includes(key)
                    )
                    .map(([key, value]) => (
                      <Box key={key} mb={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {key.replace(/_/g, " ").toUpperCase()}:
                        </Typography>
                        <Typography variant="body1">
                          {Array.isArray(value)
                            ? value.join(", ")
                            : String(value)}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                      </Box>
                    ))}

                  {/* Librarian Details */}
                  <Typography variant="h6" mt={2}>
                    👤 Librarian Details
                  </Typography>
                                  <Typography>Name: {bookData.librarian?.name}</Typography>
                                  <Typography>DOB: {bookData.librarian?.dob}</Typography>
                                  <Box mt={3}>
                    <LibraryInfoCard
                      library={bookData.library}
                      extra=""
                      loading={false}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box textAlign="center" mt={3}>
            <Button variant="contained" onClick={handleScanAnother}>
              🔄 Scan Another
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default QRScanner;
