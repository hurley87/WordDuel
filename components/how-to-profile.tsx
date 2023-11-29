'use client';

import '@/styles/globals.css';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { getUserDuels } from '@/lib/db';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useXPRead } from '@/hooks/useXPRead';

type HowToProfileProps = {
  children: React.ReactNode;
};

function HowToProfile({ children }: HowToProfileProps) {
  const { user, login, logout } = usePrivy();
  const address = user?.wallet?.address as `0x${string}`;
  const { data: queryDuels } = useQuery({
    queryKey: ['duels', address],
    queryFn: () => getUserDuels(address),
  });
  const level =
    queryDuels?.filter((duel) => duel.is_winner === true).length || 0;
  const { data: xpBalance } = useXPRead({
    functionName: 'balanceOf',
    args: [address],
  });
  const XP = parseInt(xpBalance || '0') / 10 ** 18;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
        </DialogHeader>
        <div className="text-left flex flex-col gap-4 text-sm py-6">
          <div>
            <p className="font-bold">Account</p>
            <p>
              View your account on{' '}
              <Link
                className="underline"
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/address/${process.env.NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS}`}
              >
                Base
              </Link>
              .
            </p>
          </div>
          <div>
            <p className="font-bold">Wallet Address</p>
            <p>{address}</p>
          </div>
          <div>
            <p className="font-bold">Level</p>
            <p>{level}</p>
          </div>
          <div>
            <p className="font-bold">$XP Tokens</p>
            <p>{XP}</p>
          </div>
          <p>
            View the $XP token contract on{' '}
            <Link
              className="underline"
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/address/${process.env.NEXT_PUBLIC_XP_CONTRACT_ADDRESS}`}
            >
              Base
            </Link>
            .
          </p>
        </div>
        <DialogFooter>
          {!user ? (
            <Button onClick={login} className="w-full">
              Play WordDuel
            </Button>
          ) : (
            <Button onClick={logout} className="w-full">
              Logout
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default HowToProfile;
