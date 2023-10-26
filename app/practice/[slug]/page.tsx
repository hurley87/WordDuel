'use client';

import { DuelCancelled } from '@/components/duel-cancelled';
import Loading from '@/components/loading';
import { useFreeRead } from '@/hooks/useFreeRead';
import { useEffect } from 'react';
import GetStarted from '@/components/get-started';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { DuelCreatedChallengerFree } from '@/components/duel-created-challender-free';
import { DuelCreatedOpponentFree } from '@/components/duel-created-opponent-free';
import { DuelFinishedFree } from '@/components/duel-finished-free';
import { DuelGamePlayFree } from '@/components/duel-gameplay-free';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Layout from '@/components/layout';

export default function Page({ params }: { params: { slug: string } }) {
  const { wallet, ready } = usePrivyWagmi();
  const { data: duel, isLoading } = useFreeRead({
    functionName: 'getDuel',
    watch: true,
    args: [parseInt(params.slug)],
  });
  const yourTurn =
    duel?.currentPlayer?.toLowerCase() === wallet?.address.toLowerCase();
  const isChallenger =
    duel?.challenger?.toLowerCase() === wallet?.address.toLowerCase();
  const isCreated = duel?.state === 0;
  const isAccepted = duel?.state === 1;
  const isCancelled = duel?.state === 3;
  const isFinished = duel?.state === 2;
  const router = useRouter();

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

  if (!wallet)
    return (
      <Layout title="Get Started">
        <GetStarted />
      </Layout>
    );

  if (!ready)
    return (
      <Layout title="Get Started">
        <Loading />
      </Layout>
    );

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
        {isCreated && isChallenger && <DuelCreatedChallengerFree duel={duel} />}
        {isCreated && !isChallenger && <DuelCreatedOpponentFree duel={duel} />}
        {isCancelled && <DuelCancelled />}
        {wallet && isFinished && (
          <DuelFinishedFree duel={duel} yourTurn={yourTurn} />
        )}
        {wallet && isAccepted && (
          <DuelGamePlayFree duel={duel} yourTurn={yourTurn} />
        )}
      </div>
    </div>
  );
}
