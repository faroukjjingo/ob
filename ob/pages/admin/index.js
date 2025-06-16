import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/AdminDashboard.module.css';
import Link from 'next/link';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [grants, setGrants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Login</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={styles.inputField}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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