// components/Navbar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Award,
  Trophy,
  Users,
  BookOpen,
  GraduationCap,
  Briefcase,
  Home,
  FileText,
  Globe,
  Calendar,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Grants', href: '/grants', icon: Award },
    { name: 'Competitions', href: '/competitions', icon: Trophy },
    { name: 'Conferences', href: '/conferences', icon: Users },
    { name: 'Scholarships', href: '/scholarships', icon: GraduationCap },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Internships', href: '/internships', icon: FileText },
    { name: 'Fellowships', href: '/fellowships', icon: Lightbulb },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? 'unset' : 'hidden';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <img
              src="/logo.jpg"
              alt="Opportunity Board Logo"
              className={styles.logoImage}
            />
          </Link>
          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        {/* Navigation Items */}
        <nav className={styles.nav}>
          <div className={styles.navList}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={styles.navItem}
                >
                  <Icon size={20} />
                  <span className={styles.navText}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && <div className={styles.overlay} onClick={toggleMenu} />}
    </>
  );
}