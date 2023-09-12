'use client';

import { DuelGamePlay } from '@/components/duel-gameplay';
import { DuelCancelled } from '@/components/duel-cancelled';
import { DuelCreatedChallenger } from '@/components/duel-created-challenger';
import { DuelCreatedOpponent } from '@/components/duel-created-opponent';
import { DuelFinished } from '@/components/duel-finished';
import Loading from '@/components/loading';
import { useRead } from '@/hooks/useRead';
import { UserContext } from '@/lib/UserContext';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import GetStarted from '@/components/get-started';
import NotInvited from '@/components/not-invited';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useBalance } from 'wagmi';
import GetETH from '@/components/get-eth';
import { Badge } from '@/components/ui/badge';

export default function Page({ params }: { params: { slug: string } }) {
  const [user, _]: any = useContext(UserContext);
  const { data } = useBalance({
    address: user?.publicAddress,
  });
  const balance = parseFloat(data?.formatted || '0');
  const { data: duel, isLoading } = useRead({
    functionName: 'getDuel',
    watch: true,
    args: [parseInt(params.slug)],
  });
  const yourTurn =
    duel?.currentPlayer?.toLowerCase() === user?.publicAddress?.toLowerCase();

  const isChallenger =
    duel?.challenger?.toLowerCase() === user?.publicAddress?.toLowerCase();
  const isOpponent = duel?.email.toLowerCase() === user?.email?.toLowerCase();
  const notOpponentOrChallenger = !isChallenger && !isOpponent;
  const isCreated = duel?.state === 0;
  const isAccepted = duel?.state === 1;
  const isCancelled = duel?.state === 3;
  const isFinished = duel?.state === 2;
  const router = useRouter();
  const amount = Number(duel?.moveAmount) / 10 ** 18;
  const tooPoor = balance * 5 < amount;

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
      {isLoading || (user && user.loading) ? (
        <Loading />
      ) : (
        <>
          {user && tooPoor && !notOpponentOrChallenger && (
            <div className="flex flex-col gap-6">
              <div className="mx-auto">
                <Badge variant="destructive">
                  You need to deposit {(Number(duel.moveAmount) / 10 ** 18) * 5}{' '}
                  ETH
                </Badge>
              </div>
              <GetETH />
            </div>
          )}
          {(isLoading || (user && user.loading) || !user) && (
            <GetStarted r={duel.id} />
          )}
          {user && !user.loading && notOpponentOrChallenger && (
            <NotInvited duel={duel} />
          )}
          {isCreated && isChallenger && <DuelCreatedChallenger duel={duel} />}
          {isCreated && isOpponent && !tooPoor && (
            <DuelCreatedOpponent duel={duel} />
          )}
          {isCancelled && <DuelCancelled />}
          {user && isFinished && (
            <DuelFinished duel={duel} yourTurn={yourTurn} />
          )}
          {user && !user.loading && isAccepted && (
            <DuelGamePlay duel={duel} yourTurn={yourTurn} />
          )}
        </>
      )}
    </div>
  );
}
