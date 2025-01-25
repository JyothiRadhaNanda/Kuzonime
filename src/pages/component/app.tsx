// src/components/App.tsx
import React, { useState, useEffect } from "react";
import Login from "./login";
import HomePage from "./home"; // Pastikan Anda sudah memiliki komponen HomePage

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Periksa apakah token sudah ada di localStorage saat pertama kali aplikasi di-load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true); // Anggap pengguna sudah login jika ada token
    }
  }, []);

  const handleLogin = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      // Kirim permintaan login ke backend
      const response = await fetch("http://localhost:3030/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data); // Debug respons login

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token); // Simpan token ke localStorage
        setToken(data.token); // Set token di state
        setIsLoggedIn(true); // Set status login
      } else {
        console.error("Login failed:", data.message || "Unknown error");
        alert("Login gagal. Periksa kembali email dan password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Terjadi kesalahan saat mencoba login.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token dari localStorage
    setToken(null); // Reset state token
    setIsLoggedIn(false); // Set status login ke false
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Welcome to Book Management App</h1>
          <HomePage /> {/* Tampilkan komponen HomePage setelah login */}
          <button onClick={handleLogout}>Logout</button> {/* Tombol logout */}
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
