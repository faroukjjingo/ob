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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? 'unset' : 'hidden';
  };

  return (
    <nav
      className={`fixed w-full bg-white shadow-md z-10 transition-transform ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          <img src="/logo.png" alt="Opportunity Board Logo" className="h-8" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-start space-y-4 px-4 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}