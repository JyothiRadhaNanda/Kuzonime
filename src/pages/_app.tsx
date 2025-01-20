import "@/styles/globals.css"; // Mengimpor file CSS global dengan Tailwind
import type { AppProps } from "next/app"; // Mengimpor tipe untuk AppProps

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />; // Render halaman dengan props yang diteruskan
}
