project/components/Navbar.js
import Link from 'next/link';
import styles from '../styles/OpportunityDetail.module.css';

export default function Navbar() {
  return (
    <nav className="bg-surface shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-text-primary">
          Grant Website
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-text-secondary hover:text-text-primary">
            Home
          </Link>
          <Link href="/admin" className="text-text-secondary hover:text-text-primary">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}