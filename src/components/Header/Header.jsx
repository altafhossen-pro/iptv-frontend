'use client';

import { AuthContext } from '@/provider/AuthProvider';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/`} className="text-xl lg:text-2xl font-bold text-blue-400">IPTV Pro</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          <nav className="space-x-4">
            <Link href="/" className="text-gray-300 px-2 hover:text-white">Home</Link>
            <Link href="/about" className="text-gray-300 px-2 hover:text-white">About</Link>
            <Link href="/contact" className="text-gray-300 px-2 hover:text-white">Contact</Link>
            {
              user?.email ? (
                <Link href="/profile" className="text-gray-300 px-2 hover:text-white">Profile</Link>
              ) : (
                <Link href="/login" className="text-gray-300 px-2 hover:text-white">Login</Link>
              )
            }
            {
              user?.email && user?.role === 'admin' && (
                <Link href="/admin/dashboard" className="text-gray-300 px-2 hover:text-white">Admin Dashboard</Link>
              )
            }
            {
              !user?.email && (
                <Link href="/register" className="text-white rounded hover:text-white bg-pink-600 px-4 py-2">Join Now</Link>
              )
            }
            {
              user?.email && (
                <button onClick={handleLogout} className="text-gray-200  hover:text-white bg-pink-500 hover:bg-pink-600 transition rounded px-6 py-2 cursor-pointer">Logout</button>
              )
            }
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-300 hover:text-white p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-gray-700">
          <nav className="flex flex-col space-y-2 mt-4">
            <Link
              href="/"
              className="text-gray-300 px-2 py-2 hover:text-white hover:bg-gray-700 rounded"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-300 px-2 py-2 hover:text-white hover:bg-gray-700 rounded"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 px-2 py-2 hover:text-white hover:bg-gray-700 rounded"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            {
              user?.email ? (
                <Link
                  href="/profile"
                  className="text-gray-300 px-2 py-2 hover:text-white hover:bg-gray-700 rounded"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-300 px-2 py-2 hover:text-white hover:bg-gray-700 rounded"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              )
            }
            {
              user?.email && user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-gray-300 px-2 py-2 hover:text-white hover:bg-gray-700 rounded"
                  onClick={closeMobileMenu}
                >
                  Admin Dashboard
                </Link>
              )
            }
            {
              !user?.email && (
                <Link
                  href="/register"
                  className="text-white rounded bg-pink-600 hover:bg-pink-700 px-4 py-2 text-center mx-2"
                  onClick={closeMobileMenu}
                >
                  Join Now
                </Link>
              )
            }
            {
              user?.email && (
                <button
                  onClick={handleLogout}
                  className="text-gray-300 px-2 py-2 hover:text-white hover:bg-gray-700 rounded"
                >
                  Logout
                </button>
              )
            }
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;