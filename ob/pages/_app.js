// pages/_app.js
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Grant Website</title>
        <meta name="description" content="Grant opportunities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="main-container">
        <Component {...pageProps} />
      </main>
      <Footer />
    </AuthProvider>
  );
}