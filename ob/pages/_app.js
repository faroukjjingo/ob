project/pages/_app.js
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';
import { FirebaseProvider } from '../lib/firebase';

export default function App({ Component, pageProps }) {
  return (
    <FirebaseProvider>
      <Head>
        <title>Grant Website</title>
        <meta name="description" content="Grant opportunities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-background">
        <Component {...pageProps} />
      </main>
      <Footer />
    </FirebaseProvider>
  );
}