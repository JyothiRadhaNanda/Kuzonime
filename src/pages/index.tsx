import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import AddBook from "./CRUD/create";
import HomePage from "./component/home";
import Navbar from "./component/navigation/navbar";
import App from "./component/app";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
      <Navbar />
      {/* <HomePage /> */}
      <AddBook />
      <App />
    </div>
  );
}
