'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { logout } from '@/lib/services';
import { Menu, LogOut, Settings, User } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    window.location.href = `${apiUrl}/auth/login`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      logoutStore();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow">
      <div className="container-custom py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          OneLink
        </Link>

        <nav className="flex items-center gap-6">
          {!mounted ? null : isAuthenticated && user ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/portfolio" className="hover:text-blue-600">
                Portfolio
              </Link>
              <Link href={`/profile/${user.portfolio_username}`} className="hover:text-blue-600">
                View Public Profile
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/settings" title="Settings">
                  <Settings size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 btn-secondary"
                  title="Logout"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button onClick={handleLogin} className="btn-primary">
                Login with GitHub
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
