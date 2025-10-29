import { useEffect, useState, useRef } from "react";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
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
import LibraryInfoCard from "./LibraryProfile";

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);

  const cleanupReader = async () => {
    const readerElem = document.getElementById("reader");
    if (readerElem) {
      const video = readerElem.querySelector("video");
      if (video?.srcObject) {
        video.srcObject.getTracks().forEach((t) => t.stop());
      }
      readerElem.innerHTML = "";
    }
  };

  useEffect(() => {
    if (!scanning) return;

    const html5QrCode = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
    });

    html5QrCode.render(
      (decodedText) => {
        stopScanning();
        setScannedData(decodedText);
      },
      (scanError) => console.warn(scanError)
    );

    scannerRef.current = html5QrCode;

    return () => {
      stopScanning();
    };

  }, [scanning]);

  const stopScanning = async () => {
    setScanning(false);
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Scanner clear error:", err);
      } finally {
        await cleanupReader();
        scannerRef.current = null;
      }
    } else {
      await cleanupReader();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const html5QrCode = new Html5Qrcode("reader");
      const result = await html5QrCode.scanFile(file, true);
      setScannedData(result);
      await cleanupReader();
    } catch (err) {
      console.error("Image scan error:", err);
      setError("Failed to read QR from image.");
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      if (!scannedData) return;
      setLoading(true);
      setError("");
      try {
        const res = await getBookDetails(scannedData);
        setBookData(res.data);
      } catch (err) {
        console.error(err);
        setError("Invalid QR or server error.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [scannedData]);

  const handleScanAnother = () => {
    setScannedData(null);
    setBookData(null);
    setError("");
    setScanning(true);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2} textAlign="center">
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
            {!scanning ? (
              <Button variant="contained" onClick={() => setScanning(true)}>
                Start Scanning
              </Button>
            ) : (
              <Button variant="outlined" color="error" onClick={stopScanning}>
                Close Scanner
              </Button>
            )}

            <Button
              variant="outlined"
              component="label"
              sx={{ ml: 2 }}
            >
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

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 2 }}>
                <CardContent>
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
