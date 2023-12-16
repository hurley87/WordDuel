'use client';

import '@/styles/globals.css';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { getUserDuels } from '@/lib/db';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { TransferForm } from './transfer-form';

type HowToProfileProps = {
  children: React.ReactNode;
  balance: string;
};

function HowToProfile({ balance, children }: HowToProfileProps) {
  const { user, login, logout } = usePrivy();
  const address = user?.wallet?.address as `0x${string}`;
  const { data: queryDuels } = useQuery({
    queryKey: ['games', address],
    queryFn: () => getUserDuels(address),
  });
  const level =
    queryDuels?.filter((duel) => duel.is_winner === true).length || 0;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Wallet</DialogTitle>
          <DialogDescription>
            <Link
              className="underline"
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/address/${address}`}
            >
              {address}
            </Link>
          </DialogDescription>
        </DialogHeader>
        <div className="text-left flex flex-col gap-4 text-sm py-6">
          <div className="flex justify-between">
            <div>
              <p className="font-bold">Level</p>
              <p>{level}</p>
            </div>
            <div>
              <p className="font-bold">ETH</p>
              <p>{balance}</p>
            </div>
          </div>

          <TransferForm />
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
