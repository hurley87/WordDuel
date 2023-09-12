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
  CardTitle,
  CardContent,
} from './ui/card';
import Link from 'next/link';

function Duels() {
  const [user, _]: any = useContext(UserContext);
  const { data: duels, isLoading } = useRead({
    functionName: 'getMyDuels',
    args: [user?.publicAddress],
  });
  const noDuels = !isLoading && duels?.length === 0;
  const hasDuels = !isLoading && duels?.length > 0;

  const { data: invites, isLoading: invitesLoading } = useRead({
    functionName: 'getDuelsByEmail',
    args: [user?.email],
  });
  const hasInvites =
    !invitesLoading &&
    invites?.filter((invite) => invite.state === 0).length > 0;

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto px-2 pt-32">
      {hasInvites && (
        <Container>
          <Card>
            <CardHeader>
              <CardDescription>
                You have been invited to a duel.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1">
              {invites
                ?.filter((invite) => invite.state === 0)
                .map((duel: any) => (
                  <Duel key={parseInt(duel.id)} duelId={duel.id} />
                ))}
            </CardContent>
          </Card>
        </Container>
      )}
      {hasDuels && (
        <>
          <Container>
            <Card>
              <CardHeader>
                <CardDescription>
                  Challenge a friend to a duel where the winner takes all.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/new" className="w-full">
                  <Button className="w-full">New Duel</Button>
                </Link>
              </CardFooter>
            </Card>
          </Container>
          <Container>
            <Card>
              <CardHeader>
                <CardDescription>All past and current duels.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {duels.map((duelId: any) => (
                  <Duel key={parseInt(duelId)} duelId={duelId} />
                ))}
              </CardContent>
            </Card>
          </Container>
        </>
      )}

      {noDuels && (
        <Container>
          <FAQ />
        </Container>
      )}
    </div>
  );
}

export default Duels;
