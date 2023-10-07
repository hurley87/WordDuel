'use client';

import { Icons } from '@/components/icons';
import Duels from '@/components/duels';
import Loading from '@/components/loading';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { ready, authenticated, login } = usePrivy();

  if (!ready) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col max-w-sm mx-auto">
      {ready && !authenticated && (
        <div className="flex flex-col space-y-2 text-center pt-20">
          <Icons.swords className="mx-auto h-14 w-14" />
          <h1 className="text-3xl font-black tracking-tight">WordDuel</h1>
          <p className="text-muted-foreground pb-2">
            Play Wordle against your friends for ETH.
          </p>
          <Button className="mx-auto px-20 relative block" onClick={login}>
            Get Started
          </Button>
        </div>
      )}
      {ready && authenticated && <Duels />}
    </div>
  );
}
