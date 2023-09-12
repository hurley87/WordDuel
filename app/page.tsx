'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { UserAccountNav } from '@/components/user-account-nav';
import { UserContext } from '@/lib/UserContext';
import Link from 'next/link';
import { useContext } from 'react';
import { useBalance } from 'wagmi';
import Wordle from '@/components/wordle';
import Duels from '@/components/duels';
import Loading from '@/components/loading';
import GetETH from '@/components/get-eth';

export default function Home() {
  const [user, setUser]: any = useContext(UserContext);
  const { data, isLoading } = useBalance({
    address: user?.publicAddress,
  });
  const balance = parseFloat(data?.formatted || '0');

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.swords />
              <span className="font-bold">WordDuel</span>
            </Link>
          </div>
          {user ? (
            <UserAccountNav
              setUser={setUser}
              balance={balance}
              user={{
                publicAddress: user?.publicAddress,
                email: user?.email,
              }}
            />
          ) : (
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          )}
        </div>
      </header>
      {user?.loading || isLoading ? (
        <Loading />
      ) : (
        <div className="pt-10">
          {!user && <Wordle />}
          {/* has no games */}
          {user && balance > 0 && <Duels />}
          {/* has no balance */}
          {user && balance === 0 && <GetETH />}
        </div>
      )}
    </div>
  );
}
