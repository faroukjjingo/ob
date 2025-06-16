project/pages/admin/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/OpportunityDetail.module.css';
import Link from 'next/link';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleCleanup = async () => {
    const res = await fetch('/api/grants/cleanup', { method: 'POST' });
    const data = await res.json();
    setMessage(data.message);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className={styles.title}>Admin Login</h1>
        <form onSubmit={handleLogin} className="max-w-md mx-auto">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface shadow-sm w-full"
            style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
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
      <div className="flex gap-4">
        <Link href="/admin/grants/create" className={styles.primaryButton}>
          Create Grant
        </Link>
        <button onClick={handleCleanup} className={styles.primaryButton}>
          Clean Up Expired Grants
        </button>
      </div>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}