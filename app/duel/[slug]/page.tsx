'use client';

import { DuelGamePlay } from '@/components/duel-gameplay';
import { DuelCancelled } from '@/components/duel-cancelled';
import { DuelCreatedChallenger } from '@/components/duel-created-challenger';
import { DuelCreatedOpponent } from '@/components/duel-created-opponent';
import { DuelFinished } from '@/components/duel-finished';
import Loading from '@/components/loading';
import { useRead } from '@/hooks/useRead';
import { useEffect } from 'react';
import GetStarted from '@/components/get-started';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useBalance } from 'wagmi';
import GetETH from '@/components/get-eth';
import { Badge } from '@/components/ui/badge';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

export default function Page({ params }: { params: { slug: string } }) {
  const { user } = usePrivy();
  const { wallet, ready } = usePrivyWagmi();
  const { data } = useBalance({
    address: wallet?.address as `0x${string}`,
  });
  const balance = parseFloat(data?.formatted || '0');
  const { data: duel, isLoading } = useRead({
    functionName: 'getDuel',
    watch: true,
    args: [parseInt(params.slug)],
  });
  const yourTurn =
    duel?.currentPlayer?.toLowerCase() === wallet?.address?.toLowerCase();
  const isChallenger =
    duel?.challenger?.toLowerCase() === wallet?.address?.toLowerCase();
  const isCreated = duel?.state === 0;
  const isAccepted = duel?.state === 1;
  const isCancelled = duel?.state === 3;
  const isFinished = duel?.state === 2;
  const router = useRouter();
  const amount = Number(duel?.moveAmount) / 10 ** 18;
  const tooPoor = balance < amount;

  useEffect(() => {
    if (!isLoading && !duel) {
      toast({
        title: `Duel not found.`,
        description: 'Try creating a new duel.',
        variant: 'destructive',
      });
      router.push('/');
    }
  }, [isLoading, duel, router]);

  if (!ready) return <Loading />;

  if (ready && !wallet) return <GetStarted />;

  return (
    <div className="w-screen flex-col">
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
      <div className="flex flex-col gap-2 max-w-lg mx-auto px-2 pt-28">
        {tooPoor && (
          <div className="flex flex-col gap-2 pt-10">
            <div className="mx-auto">
              <Badge variant="destructive">
                You need to deposit {(Number(duel.moveAmount) / 10 ** 18) * 5}{' '}
                ETH
              </Badge>
            </div>
            <GetETH />
          </div>
        )}
        {user && isCreated && isChallenger && (
          <DuelCreatedChallenger duel={duel} />
        )}
        {user && isCreated && !isChallenger && !tooPoor && (
          <DuelCreatedOpponent duel={duel} />
        )}
        {user && isCancelled && <DuelCancelled />}
        {user && isFinished && !tooPoor && (
          <DuelFinished duel={duel} yourTurn={yourTurn} />
        )}
        {user && isAccepted && !tooPoor && (
          <DuelGamePlay duel={duel} yourTurn={yourTurn} />
        )}
      </div>
    </div>
  );
}
