import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Login from "./login";
import Register from "./register";
import HomePage from "./home";
import Navbar from "./navigation/navbar"; // Pastikan Navbar di-import

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch("http://localhost:3030/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setIsLoggedIn(true); // <-- Pastikan state diperbarui
      } else {
        alert("Login gagal. Periksa kembali email dan password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Terjadi kesalahan saat mencoba login.");
    }
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch("http://localhost:3030/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      console.log("Register Response:", data);

      if (response.ok) {
        alert("Registrasi berhasil! Silakan login.");
        setIsRegistering(false);
      } else {
        alert("Registrasi gagal: " + data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Terjadi kesalahan saat mencoba registrasi.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <div>
      {/* Navbar akan selalu muncul di semua halaman */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      {isLoggedIn ? (
        <div>
          <HomePage />
        </div>
      ) : (
        <div>harap login terlebih dahulu</div>
      )}
    </div>
  );
};

export default App;
