'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { NewDuelForm } from '@/components/new-duel-form';
import { useContext } from 'react';
import { UserContext } from '@/lib/UserContext';
import { useBalance } from 'wagmi';
import GetETH from '@/components/get-eth';

export default function NewDuelPage() {
  const [user, _]: any = useContext(UserContext);
  const { data, isLoading } = useBalance({
    address: user?.publicAddress,
  });
  const balance = parseFloat(data?.formatted || '0');

  if (balance === 0)
    return (
      <div className="mx-auto flex flex-col justify-center space-y-6 max-w-md py-24">
        <GetETH />
      </div>
    );

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8'
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Declare your {`opponent's`} email and the amount of ETH needed for
            each move.
          </p>
        </div>
        <NewDuelForm />
        <p className="text-xs text-muted-foreground">
          * a small fee (0.00093 ETH) will be charged + gas
        </p>
      </div>
    </div>
  );
}
