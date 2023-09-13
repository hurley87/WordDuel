'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { UserAccountNav } from '@/components/user-account-nav';
import { UserContext } from '@/lib/UserContext';
import Link from 'next/link';
import { useContext } from 'react';
import { useBalance } from 'wagmi';
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
      {user && (
        <header className="fixed right-0 left-0 top-0 w-full z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex gap-6 md:gap-10">
              <Link href="/" className="flex items-center space-x-2">
                <Icons.swords />
                <span className="font-bold">WordDuel</span>
              </Link>
            </div>
            <UserAccountNav
              setUser={setUser}
              balance={balance}
              user={{
                publicAddress: user?.publicAddress,
                email: user?.email,
              }}
            />
          </div>
        </header>
      )}

      {user?.loading || isLoading ? (
        <Loading />
      ) : (
        <div className="mx-auto flex flex-col justify-center space-y-6 max-w-md py-24">
          {!user && (
            <div className="flex flex-col space-y-2 text-center pt-20">
              <Icons.swords className="mx-auto h-16 w-16" />
              <h1 className="text-2xl font-black tracking-tight">WordDuel</h1>
              <p className="text-muted-foreground pb-2">
                Play Wordle against your friends for ETH.
              </p>
              <Link href={`/login`}>
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
          {/* has no games */}
          {user && balance > 0 && <Duels />}
          {/* has no balance */}
          {user && balance === 0 && <GetETH />}
        </div>
      )}
    </div>
  );
}
