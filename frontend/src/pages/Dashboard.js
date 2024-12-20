/**
 * Dashboard Component
 * Manages all subscriptions for the user: view, add, renew, delete, and notifications
 */

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

/** Service logos mapping */
const serviceLogos = {
  Netflix: "/logos/netflix.png",
  Spotify: "/logos/spotify.png",
  HBO: "/logos/hbo.png",
  Viaplay: "/logos/viaplay.png",
  YoutubeMusic: "/logos/youtubeMusic.png",
  Disney: "/logos/disney.png",
  PrimeVideo: "/logos/primevideo.png",
  AppleTV: "/logos/appleTV.png",
  AppleMusic: "/logos/appleMusic.png",
  DropBox: "/logos/dropbox.png",
  FitBit: "/logos/fitbit.png",
  OneDrive: "/logos/onedrive.png",
  PlaystationPlus: "/logos/ps.png",
  SoundCloud: "/logos/soundcloud.png",
  Steam: "/logos/steam.png",
};

/** State variables */
const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [service, setService] = useState("");
  const [customService, setCustomService] = useState("");
  const [endDate, setEndDate] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

  const userId = localStorage.getItem("userId");

  
    /**
   * Fetch all subscriptions from the backend
   */
  const fetchSubscriptions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/subscriptions?userId=${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch subscriptions");
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error(error.message);
      setSnackbar({ open: true, message: "Failed to fetch subscriptions", severity: "error" });
    }
  };

  // Fetch expiring subscriptions (notifications)
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/subscriptions/notifications");
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();

      if (data.length > 0) {
        // if there is notifikation, pop up
        setSnackbar({
          open: true,
          message: `You have ${data.length} subscription(s) expiring in 3 days!`,
          severity: "warning",
        });
      }
      setNotifications(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * Add a new subscription
   */
  const handleAddSubscription = async () => {
    const finalService = service || customService;

    if (!finalService || !endDate) {
      setSnackbar({ open: true, message: "Please fill in all fields!", severity: "error" });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, service: finalService, endDate }),
      });

      if (!response.ok) throw new Error("Failed to add subscription");
      setSnackbar({
        open: true,
        message: `Subscription for ${finalService} created successfully!`,
        severity: "success",
      });
      fetchSubscriptions();
      fetchNotifications();
      setService("");
      setCustomService("");
      setEndDate("");
    } catch (error) {
      console.error(error.message);
      setSnackbar({ open: true, message: "Failed to add subscription", severity: "error" });
    }
  };

  /**
   * Renew a subscription
   */
  const handleRenew = async (id) => {
    const newEndDate = prompt("Enter new end date (YYYY-MM-DD):");
    if (!newEndDate) return;

    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endDate: newEndDate }),
      });
      if (!response.ok) throw new Error("Failed to renew subscription");
      fetchSubscriptions();
      fetchNotifications();
      setSnackbar({
        open: true,
        message: "Subscription renewed successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error(error.message);
      setSnackbar({ open: true, message: "Failed to renew subscription", severity: "error" });
    }
  };

    /**
   * Delete a subscription
   */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subscription?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete subscription");
      fetchSubscriptions();
      fetchNotifications();
      setSnackbar({
        open: true,
        message: "Subscription deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error(error.message);
      setSnackbar({ open: true, message: "Failed to delete subscription", severity: "error" });
    }
  };
/** Fetch subscriptions on load */
  useEffect(() => {
    fetchSubscriptions();
    fetchNotifications();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Subscriptions
      </Typography>

      {/* Add Subscription Form */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Service</InputLabel>
          <Select
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              setCustomService("");
            }}
            displayEmpty
          >
            {Object.keys(serviceLogos).map((key) => (
              <MenuItem key={key} value={key}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src={serviceLogos[key]}
                    alt={key}
                    style={{ width: 24, height: 24 }}
                  />
                  {key}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Custom Service"
          value={customService}
          onChange={(e) => setCustomService(e.target.value)}
          fullWidth
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAddSubscription}>
          Add Subscription
        </Button>
      </Box>

      {/* Subscriptions */}
      <Grid container spacing={2}>
        {subscriptions.map((sub) => (
          <Grid item xs={12} sm={6} md={4} key={sub._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{sub.service}</Typography>
                <Typography>Expires: {new Date(sub.endDate).toLocaleDateString()}</Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={() => handleRenew(sub._id)}>
                  Renew
                </Button>
                <Button color="error" onClick={() => handleDelete(sub._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
