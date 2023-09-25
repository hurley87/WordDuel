'use client';

import '@/styles/globals.css';
import { UserContext } from '@/lib/UserContext';
import { useContext } from 'react';
import { useRead } from '@/hooks/useRead';
import FAQ from './faq';
import { Duel } from './duel';
import { Container } from './container';
import { Button } from './ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardContent,
} from './ui/card';
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

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto px-2">
      {user && (
        <Container>
          <Card>
            <CardHeader>
              <CardDescription>
                Challenge a friend to a duel and play for ETH or practice
                playing against a friend for free.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex flex-col gap-2 w-full">
                <Link href="/duel" className="w-full">
                  <Button className="w-full">New Duel</Button>
                </Link>
                <Link href="/practice" className="w-full">
                  <Button variant="secondary" className="w-full">
                    Start Practice
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
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
