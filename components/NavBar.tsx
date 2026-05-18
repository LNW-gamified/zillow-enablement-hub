'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { label: 'Launch Brief',   href: '/brief' },
  { label: 'Certification',  href: '/certification' },
  { label: 'Manager Dashboard', href: '/dashboard' },
  { label: 'Hypothesis Log', href: '/hypothesis' },
  { label: 'Knowledge Base', href: '/knowledge' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center">
            <img
              src="/zillow-logo.svg"
              alt="Zillow"
              style={{ height: '32px', width: 'auto' }}
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-sm font-medium pb-1 transition-colors duration-150 group ${
                    active ? 'text-zillow-blue' : 'text-[#4A5568] hover:text-zillow-navy'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-zillow-blue rounded-full transition-all duration-200 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[#4A5568] hover:text-zillow-navy focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium py-2.5 px-3 rounded-md border-l-4 transition-colors duration-150 ${
                    active
                      ? 'border-zillow-blue text-zillow-blue bg-blue-50'
                      : 'border-transparent text-[#4A5568] hover:text-zillow-navy hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
