'use client';

import '@/styles/globals.css';
import { UserContext } from '@/lib/UserContext';
import { useContext } from 'react';
import { useRead } from '@/hooks/useRead';
import Onboarding from './onboarding';
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

  console.log(isLoading);
  console.log(duels);
  const noDuels = !isLoading && duels?.length === 0;
  const hasDuels = !isLoading && duels?.length > 0;

  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto px-2">
      {hasDuels && (
        <>
          <Container>
            <Card>
              <CardHeader>
                <CardTitle>New Duel</CardTitle>
                <CardDescription>
                  Challenge a friend to a duel. The winner takes all.
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
                <CardTitle>New Duel</CardTitle>
                <CardDescription>
                  Challenge a friend to a duel. The winner takes all.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-1">
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
          <Onboarding />
        </Container>
      )}
    </div>
  );
}

export default Duels;
