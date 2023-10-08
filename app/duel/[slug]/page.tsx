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

  return (
    <div className="mx-auto flex flex-col justify-center space-y-0 max-w-md pt-20">
      {tooPoor && (
        <div className="flex flex-col gap-2">
          <div className="mx-auto">
            <Badge variant="destructive">
              You need to deposit {(Number(duel.moveAmount) / 10 ** 18) * 5} ETH
            </Badge>
          </div>
          <GetETH />
        </div>
      )}
      {ready && !user && <GetStarted />}
      {user && isCreated && isChallenger && (
        <DuelCreatedChallenger duel={duel} />
      )}
      {user && isCreated && !isChallenger && !tooPoor && (
        <DuelCreatedOpponent duel={duel} />
      )}
      {user && isCancelled && <DuelCancelled />}
      {user && isFinished && <DuelFinished duel={duel} yourTurn={yourTurn} />}
      {user && isAccepted && <DuelGamePlay duel={duel} yourTurn={yourTurn} />}
    </div>
  );
}
