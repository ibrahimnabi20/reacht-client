import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("userId", data.userId);
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Login failed! ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #6DD5FA, #2980B9)",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "#2980B9",
            fontWeight: "bold",
            marginBottom: "10px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Welcome to SubMind
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#555", marginBottom: "20px" }}
        >
          Manage your subscriptions easily
        </Typography>

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: "20px" }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: "#2980B9",
            "&:hover": { backgroundColor: "#1F618D" },
            fontWeight: "bold",
          }}
          onClick={handleLogin}
        >
          LOGIN
        </Button>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2, color: "#2980B9", fontWeight: "bold" }}
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register here
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
