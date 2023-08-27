'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { UserAccountNav } from '@/components/user-account-nav';
import { UserContext } from '@/lib/UserContext';
import Link from 'next/link';
import { useContext } from 'react';
import { useBalance } from 'wagmi';
import { toast } from '@/components/ui/use-toast';
import Wordle from '@/components/wordle';
import Duels from '@/components/duels';
import Loading from '@/components/loading';

export default function Home() {
  const [user, setUser]: any = useContext(UserContext);
  const { data, isLoading } = useBalance({
    address: user?.publicAddress,
  });
  const balance = parseFloat(data?.formatted || '0');

  function handleCopyToClipBoard() {
    navigator.clipboard.writeText(user?.publicAddress);
    return toast({
      title: 'Copied to clipboard.',
      description: 'Now send some ETH to your wallet.',
    });
  }

  console.log(user);

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
              user={{
                publicAddress: user?.publicAddress,
                email: user?.email,
              }}
            />
          ) : (
            <Link href="/login">
              <Button variant="outline">Login</Button>
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
          {user && balance === 0 && (
            <div className="flex flex-col flex-1 max-w-md mx-auto pt-20 gap-4">
              <Icons.wallet className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-bold">Get some ETH on Base</h2>
                <p>
                  {"You'll"} use ETH, the official currency of Base, each time
                  you make a move in WordDuel. Get started by adding some ETH to
                  your wallet shown below.
                </p>
              </div>

              <div
                onClick={handleCopyToClipBoard}
                className="flex items-center w-full rounded-md border shadow p-6 cursor-pointer"
              >
                <Icons.copy className="h-9 w-9" />
                <div className="ml-4 space-y-1 w-full">
                  <p className="text-sm font-medium leading-none">
                    Copy Your Wallet Address
                  </p>
                  <p className="text-sm text-muted-foreground text-blue-500">
                    {user?.publicAddress}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <p>Wallet Balance: {balance} ETH </p>
                <Icons.refresh
                  onClick={() => window.location.reload()}
                  className="h-4 w-4 relative top-1 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
