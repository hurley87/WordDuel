'use client';

import { DuelGamePlay } from '@/components/duel-gameplay';
import { DuelCancelled } from '@/components/duel-cancelled';
import Loading from '@/components/loading';
import { useFreeRead } from '@/hooks/useFreeRead';
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
import { DuelCreatedChallengerFree } from '@/components/duel-created-challender-free';
import { DuelCreatedOpponentFree } from '@/components/duel-created-opponent-free';
import { DuelFinishedFree } from '@/components/duel-finished-free';
import { DuelGamePlayFree } from '@/components/duel-gameplay-free';

export default function Page({ params }: { params: { slug: string } }) {
  const [user, _]: any = useContext(UserContext);
  const { data: duel, isLoading } = useFreeRead({
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

  useEffect(() => {
    if (!isLoading && !duel) {
      toast({
        title: `Duel not found.`,
        description: 'Try creating a new duel.',
        variant: 'destructive',
      });
      router.push('/');
    }
  }, [isLoading, duel, router, user]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
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
          {(isLoading || (user && user.loading) || !user) && <GetStarted />}
          {user && !user.loading && notOpponentOrChallenger && (
            <NotInvited duel={duel} />
          )}
          {isCreated && isChallenger && (
            <DuelCreatedChallengerFree duel={duel} />
          )}
          {isCreated && isOpponent && <DuelCreatedOpponentFree duel={duel} />}
          {isCancelled && <DuelCancelled />}
          {user && isFinished && (
            <DuelFinishedFree duel={duel} yourTurn={yourTurn} />
          )}
          {user && !user.loading && isAccepted && (
            <DuelGamePlayFree duel={duel} yourTurn={yourTurn} />
          )}
        </>
      )}
    </div>
  );
}
