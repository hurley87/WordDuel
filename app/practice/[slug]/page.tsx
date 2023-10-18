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

  if (!wallet) return <GetStarted />;

  if (!ready) return <Loading />;

  return (
    <div className="mx-auto flex flex-col justify-center space-y-0 max-w-md  pt-11">
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
  );
}
