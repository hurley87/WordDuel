'use client';

import '@/styles/globals.css';
import { UserContext } from '@/lib/UserContext';
import { useContext } from 'react';
import { useRead } from '@/hooks/useRead';
import FAQ from './faq';
import { Duel } from './duel';
import { Container } from './container';
import { Button } from './ui/button';
import Link from 'next/link';
import { useFreeRead } from '@/hooks/useFreeRead';
import { DuelFree } from './duel-free';

function Duels() {
  const [user, _]: any = useContext(UserContext);
  const { data: duels } = useRead({
    functionName: 'getMyDuels',
    args: [user?.publicAddress],
  });
  const { data: duelsfree } = useFreeRead({
    functionName: 'getMyDuels',
    args: [user?.publicAddress],
  });
  const { data: invites, isLoading: invitesLoading } = useRead({
    functionName: 'getDuelsByEmail',
    args: [user?.email],
  });
  const { data: invitesfree, isLoading: invitesFreeLoading } = useFreeRead({
    functionName: 'getDuelsByEmail',
    args: [user?.email],
  });
  const noDuels = !duels?.length && !invites?.length;

  // create function that combines duels and invites and sorts by date
  function compare(a: any, b: any) {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    let comparison = 0;
    if (dateA > dateB) {
      comparison = 1;
    } else if (dateA < dateB) {
      comparison = -1;
    }
    return comparison;
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[330px]">
      {user && (
        <Container>
          <div className="flex flex-col gap-2 w-full">
            <Link href="/duel" className="w-full">
              <Button className="w-full">Duel for ETH</Button>
            </Link>
            <Link href="/practice" className="w-full">
              <Button variant="outline" className="w-full">
                Practice for Free
              </Button>
            </Link>
          </div>
        </Container>
      )}

      <Container>
        <div className="flex flex-col gap-2">
          {duels
            ?.reverse()
            .map((duelId: any) => (
              <Duel key={parseInt(duelId)} duelId={duelId} />
            ))}
          {invites
            ?.filter((invite) => invite.state === 0)
            .map((duel: any) => (
              <Duel key={parseInt(duel.id)} duelId={duel.id} />
            ))}
          {invitesfree
            ?.filter((invite) => invite.state === 0)
            .map((duel: any) => (
              <DuelFree key={parseInt(duel.id)} duelId={duel.id} />
            ))}
          {duelsfree
            ?.reverse()
            .map((duelId: any) => (
              <DuelFree key={parseInt(duelId)} duelId={duelId} />
            ))}
        </div>
      </Container>

      {noDuels && (
        <Container>
          <FAQ />
        </Container>
      )}
    </div>
  );
}

export default Duels;
