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
  const { data: duels, isLoading } = useRead({
    functionName: 'getMyDuels',
    args: [user?.publicAddress],
  });
  const { data: duelsfree, isLoading: isFreeLoading } = useFreeRead({
    functionName: 'getMyDuels',
    args: [user?.publicAddress],
  });
  const noDuels = !isLoading && duels?.length === 0;
  const hasDuels = !isLoading && duels?.length > 0;
  const hasFreeDuels = !isFreeLoading && duelsfree?.length > 0;
  const { data: invites, isLoading: invitesLoading } = useRead({
    functionName: 'getDuelsByEmail',
    args: [user?.email],
  });
  const { data: invitesfree, isLoading: invitesFreeLoading } = useFreeRead({
    functionName: 'getDuelsByEmail',
    args: [user?.email],
  });
  const hasInvites =
    !invitesLoading &&
    invites?.filter((invite) => invite.state === 0).length > 0;
  const hasFreeInvites =
    !invitesFreeLoading &&
    invitesfree?.filter((invite) => invite.state === 0).length > 0;

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto px-2">
      {user && (
        <Container>
          <Card>
            <CardHeader>
              <CardDescription>
                Practice playing against a friend for bragging rights.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/practice" className="w-full">
                <Button className="w-full">Start Practice</Button>
              </Link>
            </CardFooter>
          </Card>
        </Container>
      )}
      {hasFreeInvites && (
        <Container>
          <Card>
            <CardHeader>
              <CardDescription>
                {`You've`} been invited to a duel. Will you accept?
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1">
              {invitesfree
                ?.filter((invite) => invite.state === 0)
                .map((duel: any) => (
                  <DuelFree key={parseInt(duel.id)} duelId={duel.id} />
                ))}
            </CardContent>
          </Card>
        </Container>
      )}
      {hasFreeDuels && (
        <>
          <Container>
            <Card>
              <CardHeader>
                <CardDescription>Practice</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {duelsfree
                  ?.reverse()
                  .map((duelId: any) => (
                    <DuelFree key={parseInt(duelId)} duelId={duelId} />
                  ))}
              </CardContent>
            </Card>
          </Container>
        </>
      )}
      {user && (
        <Container>
          <Card>
            <CardHeader>
              <CardDescription>
                Challenge a friend to a duel and play for ETH.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/duel" className="w-full">
                <Button className="w-full">New Duel</Button>
              </Link>
            </CardFooter>
          </Card>
        </Container>
      )}
      {hasInvites && (
        <Container>
          <Card>
            <CardHeader>
              <CardDescription>
                {`You've`} been invited to a duel. {"You'll"} need ETH to play.
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
                <CardDescription>Duels</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {duels
                  ?.reverse()
                  .map((duelId: any) => (
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
