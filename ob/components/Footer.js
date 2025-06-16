import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 shadow-inner py-8">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Opportunity Board Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-800">Opportunity Board</h3>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <Link href="https://github.com/jjingofarouk" aria-label="GitHub">
                <Github size={20} className="text-gray-600 hover:text-gray-800 transition" />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter">
                <Twitter size={20} className="text-gray-600 hover:text-gray-800 transition" />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn">
                <Linkedin size={20} className="text-gray-600 hover:text-gray-800 transition" />
              </Link>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-800">Quick Links</h4>
            <nav className="mt-4 space-y-2">
              <Link href="/grants" className="text-gray-600 hover:text-gray-800 transition">
                Grants
              </Link>
              <Link href="/conferences" className="text-gray-600 hover:text-gray-800 transition">
                Conferences
              </Link>
              <Link href="/scholarships" className="text-gray-600 hover:text-gray-800 transition">
                Scholarships
              </Link>
              <Link href="/fellowships" className="text-gray-600 hover:text-gray-800 transition">
                Fellowships
              </Link>
            </nav>
          </div>

          {/* Resources Section */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-bold text-gray-800">Resources</h4>
            <nav className="mt-4 space-y-2">
              <Link href="/about" className="text-gray-600 hover:text-gray-800 transition">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-800 transition">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-800 transition">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-800 transition">
                Terms
              </Link>
            </nav>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-300 pt-4 text-center">
          <p className="text-gray-600">
            Built with <Heart size={16} className="inline text-red-500" /> in Uganda
          </p>
          <p className="text-gray-600">&copy; {new Date().getFullYear()} Opportunity Board</p>
        </div>
      </div>
    </footer>
  );
}