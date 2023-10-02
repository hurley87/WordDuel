'use client';

import '@/styles/globals.css';
import { Icons } from './icons';
import Link from 'next/link';
import { UserAccountNav } from './user-account-nav';
import { usePrivy } from '@privy-io/react-auth';

function Header() {
  const { user } = usePrivy();
  if (!user) return null;
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between py-4 px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.swords />
            <span className="font-bold">WordDuel</span>
          </Link>
        </div>
        <UserAccountNav />
      </div>
    </header>
  );
}

export default Header;
