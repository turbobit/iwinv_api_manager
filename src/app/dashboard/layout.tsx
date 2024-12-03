'use client';

import Link from 'next/link';
import { useState } from 'react';
import { logout } from '@/utils/auth';
import { BiLogOut } from 'react-icons/bi';

const menuItems = [
  { name: 'Zone', path: '/dashboard/zone' },
  { name: 'Flavors', path: '/dashboard/flavors' },
  { name: 'Images', path: '/dashboard/images' },
  { name: 'Instances', path: '/dashboard/instances' },
  { name: 'Block Storage', path: '/dashboard/storage' },
  { name: 'Bill', path: '/dashboard/bill' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <button
        className="md:hidden p-4 text-2xl"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      <nav className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'}
        md:block
        w-full md:w-64
        bg-gray-100
        p-4
        flex flex-col
        h-screen
      `}>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className="block p-2 hover:bg-gray-200 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto">
          <div className="h-[1px] bg-gray-300 mb-2" />
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          >
            <BiLogOut className="mr-2" />
            <span>로그아웃</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
} 