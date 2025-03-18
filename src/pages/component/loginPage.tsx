import React from "react";
import Login from "../component/login"; // Sesuaikan path ke `Login.tsx`
import { useRouter } from "next/router"; // Gunakan Next.js Router

const LoginPage = () => {
  const router = useRouter();

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
        localStorage.setItem("id", data.userId);
        console.log("tai:", data.userId);
        router.push("/"); // Redirect ke halaman utama setelah login sukses
      } else {
        alert(
          "Login gagal: " +
            (data.message || "Periksa kembali email dan password.")
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Terjadi kesalahan saat mencoba login.");
    }
  };

  return (
    <div>
      <Login onLogin={handleLogin} /> {/* Pastikan Login menerima onLogin */}
    </div>
  );
};

export default LoginPage;
