import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter(); // Tambahkan useRouter

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.reload(); // Paksa reload supaya navbar berubah
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
