'use client';

import Duels from '@/components/duels';
import Loading from '@/components/loading';
import { usePrivy } from '@privy-io/react-auth';
import GetStarted from '@/components/get-started';

export default function Home() {
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto">
      {ready && !authenticated && <GetStarted />}
      {ready && authenticated && <Duels />}
    </div>
  );
}
