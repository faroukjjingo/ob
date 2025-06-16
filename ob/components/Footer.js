// components/Footer.jsx
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Opportunity Board</h3>
            <p className="text-sm">Connecting you to global opportunities, built with passion in Uganda.</p>
            <div className="flex space-x-4">
              <Link href="https://github.com/jjingofarouk" aria-label="GitHub">
                <Github size={24} className="hover:text-white transition" />
              </Link>
              <Link href="https://x.com" aria-label="X">
                <Twitter size={24} className="hover:text-white transition" />
              </Link>
              <Link href="https://linkedin.com/in/farouk-jjingo" aria-label="LinkedIn">
                <Linkedin size={24} className="hover:text-white transition" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">Opportunities</h4>
            <nav className="mt-4 space-y-2">
              <Link href="/grants" className="block text-sm hover:text-white transition">
                Grants
              </Link>
              <Link href="/conferences" className="block text-sm hover:text-white transition">
                Conferences
              </Link>
              <Link href="/scholarships" className="block text-sm hover:text-white transition">
                Scholarships
              </Link>
              <Link href="/fellowships" className="block text-sm hover:text-white transition">
                Fellowships
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">Resources</h4>
            <nav className="mt-4 space-y-2">
              <Link href="/about" className="block text-sm hover:text-white transition">
                About
              </Link>
              <Link href="/contact" className="block text-sm hover:text-white transition">
                Contact
              </Link>
              <Link href="/privacy" className="block text-sm hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm hover:text-white transition">
                Terms of Service
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">Connect</h4>
            <nav className="mt-4 space-y-2">
              <Link href="https://jjingofarouk.xyz" className="block text-sm hover:text-white transition">
                Website
              </Link>
              <Link href="https://wa.me/256123456789" className="block text-sm hover:text-white transition">
                WhatsApp
              </Link>
              <Link href="mailto:jjingofarouq@gmail.com" className="block text-sm hover:text-white transition">
                Email
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm">
            Built with <Heart size={16} className="inline text-red-500" /> by{' '}
            <Link href="https://jjingofarouk.xyz" className="hover:text-white transition">
              Farouk Jjingo
            </Link>
          </p>
          <p className="text-sm mt-2">© {new Date().getFullYear()} Opportunity Board. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}