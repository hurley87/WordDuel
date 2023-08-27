'use client';

import { DuelAccepted } from '@/components/duel-accepted';
import { DuelCancelled } from '@/components/duel-cancelled';
import { DuelCreatedChallenger } from '@/components/duel-created-challenger';
import { DuelCreatedOpponent } from '@/components/duel-created-opponent';
import { DuelFinished } from '@/components/duel-finished';
import Loading from '@/components/loading';
import { useRead } from '@/hooks/useRead';
import { UserContext } from '@/lib/UserContext';
import { useContext } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function Page({ params }: { params: { slug: string } }) {
  const [user, _]: any = useContext(UserContext);
  const { data: duel, isLoading } = useRead({
    functionName: 'getDuel',
    watch: true,
    args: [parseInt(params.slug)],
  });

  console.log(user);
  console.log(duel);
  console.log(isLoading);

  const isChallenger =
    duel?.challenger.toLowerCase() === user?.publicAddress?.toLowerCase();
  const isOpponent = duel?.email.toLowerCase() === user?.email?.toLowerCase();
  const notOpponentOrChallenger = !isChallenger && !isOpponent;
  const isCreated = duel?.state === 0;
  const isAccepted = duel?.state === 1;
  const isCancelled = duel?.state === 3;
  const isFinished = duel?.state === 2;

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
      {isLoading && <Loading />}
      {notOpponentOrChallenger && <div>you are not a part of this duel</div>}
      {isCreated && isChallenger && <DuelCreatedChallenger duel={duel} />}
      {isCreated && isOpponent && <DuelCreatedOpponent duel={duel} />}
      {isCancelled && <DuelCancelled />}
      {isFinished && <DuelFinished duel={duel} />}
      {isAccepted && <DuelAccepted duel={duel} />}
    </div>
  );
}
