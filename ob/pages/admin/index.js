// pages/admin/index.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/AdminDashboard.module.css';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [grants, setGrants] = useState([]);
  const router = useRouter();

  const HARDCODED_PASSCODE = 'X7kP9mQ2'; // Hardcoded passcode

  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchGrants = async () => {
        const grantsCol = collection(db, 'grants');
        const grantsSnapshot = await getDocs(grantsCol);
        setGrants(
          grantsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      };
      fetchGrants();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === HARDCODED_PASSCODE) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setError('');
    } else {
      setError('Invalid passcode');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Login</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter Passcode"
            className={styles.inputField}
          />
          {error && <p className={styles.errorText}>{error}</p>}
          <button type="submit" className={styles.primaryButton}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.actions}>
        <Link href="/admin/grants/create" className={styles.primaryButton}>
          Create Grant
        </Link>
        <button onClick={handleLogout} className={styles.deleteButton}>
          Logout
        </button>
      </div>
      <h2 className={styles.subTitle}>Grants</h2>
      <div className={styles.grid}>
        {grants.map((grant) => (
          <div key={grant.id} className={styles.card}>
            <div>
              <h3 className={styles.cardTitle}>{grant.title}</h3>
              <p className={styles.cardSubtitle}>
                Deadline: {new Date(grant.deadline).toLocaleDateString()}
              </p>
            </div>
            <Link
              href={`/admin/grants/edit/${grant.slug}`}
              className={styles.primaryButton}
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}