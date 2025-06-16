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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Grants', href: '/grants', icon: Award },
    { name: 'Competitions', href: '/competitions', icon: Trophy },
    { name: 'Conferences', href: '/conferences', icon: Users },
    { name: 'Scholarships', href: '/scholarships', icon: GraduationCap },
    { name: 'Workshops', href: '/workshops', icon: BookOpen },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Internships', href: '/internships', icon: FileText },
    { name: 'Fellowships', href: '/fellowships', icon: Lightbulb },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Global Opportunities', href: '/global', icon: Globe },
    { name: 'Career Tips', href: '/career-tips', icon: TrendingUp },
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
      {/* Hamburger Button for Mobile */}
      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <img
              src="/logo.png"
              alt="Opportunity Board Logo"
              className={styles.logoImage}
            />
          </Link>
        </div>

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