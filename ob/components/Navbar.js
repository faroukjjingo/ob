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
        className="fixed top-4 left-4 z-50 md:hidden text-gray-800"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 md:translate-x-0 md:static md:w-64 md:flex md:flex-col md:min-h-screen`}
      >
        {/* Logo */}
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center justify-center">
            <img src="/logo.png" alt="Opportunity Board Logo" className="h-8" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto">
          <div className="flex flex-col space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
}