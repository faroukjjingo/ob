// components/Footer.jsx
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.title}>Opportunity Scout</h3>
            <p className={styles.description}>
              Connecting you to global opportunities, built with passion in Uganda.
            </p>
            <div className={styles.iconGroup}>
              <Link href="https://github.com/jjingofarouk" aria-label="GitHub">
                <Github size={24} className={styles.icon} />
              </Link>
              <Link href="https://x.com" aria-label="X">
                <Twitter size={24} className={styles.icon} />
              </Link>
              <Link href="https://linkedin.com/in/farouk-jjingo" aria-label="LinkedIn">
                <Linkedin size={24} className={styles.icon} />
              </Link>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.subtitle}>Opportunities</h4>
            <nav className={styles.nav}>
              <Link href="/grants" className={styles.link}>Grants</Link>
              <Link href="/conferences" className={styles.link}>Conferences</Link>
              <Link href="/scholarships" className={styles.link}>Scholarships</Link>
              <Link href="/fellowships" className={styles.link}>Fellowships</Link>
            </nav>
          </div>

          <div className={styles.column}>
            <h4 className={styles.subtitle}>Resources</h4>
            <nav className={styles.nav}>
              <Link href="/about" className={styles.link}>About</Link>
              <Link href="/contact" className={styles.link}>Contact</Link>
              <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
              <Link href="/terms" className={styles.link}>Terms of Service</Link>
            </nav>
          </div>

          <div className={styles.column}>
            <h4 className={styles.subtitle}>Connect</h4>
            <nav className={styles.nav}>
              <Link href="https://jjingofarouk.xyz" className={styles.link}>Website</Link>
              <Link href="https://wa.me/256123456789" className={styles.link}>WhatsApp</Link>
              <Link href="mailto:jjingofarouq@gmail.com" className={styles.link}>Email</Link>
            </nav>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerText}>
            Built with <Heart size={16} className={styles.heartIcon} /> by{' '}
            <Link href="https://jjingofarouk.xyz" className={styles.footerLink}>
              Farouk Jjingo
            </Link>
          </p>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Opportunity Board. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}