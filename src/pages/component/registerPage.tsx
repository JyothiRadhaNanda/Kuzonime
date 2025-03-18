import React from "react";
import Register from "../component/register"; // Pastikan path-nya benar
import { useRouter } from "next/router";
import Link from "next/link";

const RegisterPage = () => {
  const router = useRouter();

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
        alert("Registrasi berhasil! Silahkan login.");
        router.push("/component/loginPage"); // Redirect ke login setelah register sukses
      } else {
        alert("Registrasi gagal: " + (data.message || "Coba lagi."));
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Terjadi kesalahan saat registrasi.");
    }
  };

  return (
    <div>
      <Register onRegister={handleRegister} />
    </div>
  );
};

export default RegisterPage;
