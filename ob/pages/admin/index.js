// project/pages/admin/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/OpportunityDetail.module.css';
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
        setGrants(grantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      <div className="container mx-auto px-4 py-8">
        <h1 className={styles.title}>Admin Login</h1>
        <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-surface shadow-sm w-full"
            style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-surface shadow-sm w-full"
            style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className={styles.primaryButton}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className="flex gap-4 mb-8">
        <Link href="/admin/grants/create" className={styles.primaryButton}>
          Create Grant
        </Link>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">
          Logout
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Grants</h2>
      <div className="grid gap-4">
        {grants.map((grant) => (
          <div key={grant.id} className="bg-surface shadow-md rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{grant.title}</h3>
              <p className="text-text-secondary">Deadline: {new Date(grant.deadline).toLocaleDateString()}</p>
            </div>
            <Link href={`/admin/grants/edit/${grant.slug}`} className={styles.primaryButton}>
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}