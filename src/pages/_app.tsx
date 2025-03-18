import "../styles/globals.css"; // Jika ada styling global
import type { AppProps } from "next/app";
import Layout from "./component/navigation/layout"; // Sesuaikan path

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
